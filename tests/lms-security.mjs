import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
const ids = {
  m1: "11111111-1111-4111-8111-111111111111",
  m2: "22222222-2222-4222-8222-222222222222",
  s1: "33333333-3333-4333-8333-333333333333",
  s2: "44444444-4444-4444-8444-444444444444",
};
async function as(user) {
  await db.exec(
    `reset role; set role authenticated; set request.jwt.claim.sub = '${ids[user]}';`,
  );
}
async function deny(sql, params) {
  await assert.rejects(() => db.query(sql, params));
}
try {
  await db.exec(`create schema auth; create role anon; create role authenticated;
    create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz, raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated; grant execute on function auth.uid() to authenticated;`);
  for (const [name, id] of Object.entries(ids))
    await db.query("insert into auth.users values($1,$2,now(),$3)", [
      id,
      name + "@example.com",
      { full_name: name, role: "mentor" },
    ]);
  await db.exec(
    fs.readFileSync(
      new URL(
        "../supabase/migrations/20261008_lms_portal.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  for (const name of Object.keys(ids)) {
    await as(name);
    await db.query("select public.lms_ensure_profile()");
  }
  await db.exec("reset role");
  await db.query(
    "update public.lms_profiles set role='mentor' where id=any($1::uuid[])",
    [[ids.m1, ids.m2]],
  );
  await as("m1");
  const c1 = (
    await db.query(
      "insert into public.lms_courses(mentor_id,program_slug,title,published) values($1,'finance','Finance Batch',true) returning id",
      [ids.m1],
    )
  ).rows[0].id;
  const draft = (
    await db.query(
      "insert into public.lms_courses(mentor_id,program_slug,title) values($1,'finance','Draft Batch') returning id",
      [ids.m1],
    )
  ).rows[0].id;
  await db.query("select public.lms_enroll_student($1,$2)", [
    c1,
    "s1@example.com",
  ]);
  await db.query("select public.lms_enroll_student($1,$2)", [
    draft,
    "s1@example.com",
  ]);
  const l1 = (
    await db.query(
      "insert into public.lms_lessons(course_id,title,content,published) values($1,'Statements','Practice notes',true) returning id",
      [c1],
    )
  ).rows[0].id;
  const ld = (
    await db.query(
      "insert into public.lms_lessons(course_id,title,content) values($1,'Draft Lesson','Draft notes') returning id",
      [c1],
    )
  ).rows[0].id;
  const a1 = (
    await db.query(
      "insert into public.lms_assignments(course_id,title,instructions,published) values($1,'Analysis','Analyse sample statements',true) returning id",
      [c1],
    )
  ).rows[0].id;
  await as("m2");
  const c2 = (
    await db.query(
      "insert into public.lms_courses(mentor_id,program_slug,title,published) values($1,'finance','Other Mentor Batch',true) returning id",
      [ids.m2],
    )
  ).rows[0].id;
  await db.query("select public.lms_enroll_student($1,$2)", [
    c2,
    "s2@example.com",
  ]);
  await as("s1");
  assert.equal(
    (
      await db.query("select role from public.lms_profiles where id=$1", [
        ids.s1,
      ])
    ).rows[0].role,
    "student",
    "user metadata must not promote a student",
  );
  assert.equal(
    (await db.query("select * from public.lms_profiles")).rows.length,
    1,
  );
  await deny("update public.lms_profiles set role='mentor' where id=$1", [
    ids.s1,
  ]);
  await deny(
    "insert into public.lms_courses(mentor_id,program_slug,title) values($1,'finance','Unauthorized')",
    [ids.s1],
  );
  await deny("select public.lms_enroll_student($1,$2)", [c2, "s1@example.com"]);
  assert.deepEqual(
    (await db.query("select id from public.lms_courses")).rows.map((r) => r.id),
    [c1],
  );
  assert.deepEqual(
    (await db.query("select id from public.lms_lessons")).rows.map((r) => r.id),
    [l1],
  );
  await db.query(
    "insert into public.lms_progress(student_id,lesson_id) values($1,$2)",
    [ids.s1, l1],
  );
  await deny(
    "insert into public.lms_progress(student_id,lesson_id) values($1,$2)",
    [ids.s2, l1],
  );
  await deny(
    "insert into public.lms_progress(student_id,lesson_id) values($1,$2)",
    [ids.s1, ld],
  );
  const sub = (
    await db.query("select public.lms_submit_assignment($1,$2,$3) as id", [
      a1,
      "My analysis",
      "https://example.com/report",
    ])
  ).rows[0].id;
  await deny("update public.lms_submissions set score=100 where id=$1", [sub]);
  await deny("select public.lms_grade_submission($1,$2,$3)", [
    sub,
    100,
    "Self grading",
  ]);
  await as("m2");
  assert.equal(
    (await db.query("select id from public.lms_courses where id=$1", [c1])).rows
      .length,
    0,
  );
  await deny("select public.lms_grade_submission($1,$2,$3)", [
    sub,
    100,
    "Wrong mentor",
  ]);
  await deny("insert into public.lms_lessons(course_id,title) values($1,$2)", [
    c1,
    "Unauthorized lesson",
  ]);
  await as("m1");
  await db.query("select public.lms_grade_submission($1,$2,$3)", [
    sub,
    85,
    "Good analysis; explain your assumptions.",
  ]);
  assert.equal(
    (
      await db.query("select score from public.lms_submissions where id=$1", [
        sub,
      ])
    ).rows[0].score,
    85,
  );
  await as("s1");
  await deny("select public.lms_submit_assignment($1,$2,null)", [
    a1,
    "Replace graded work",
  ]);
  assert.equal(
    (
      await db.query("select score from public.lms_submissions where id=$1", [
        sub,
      ])
    ).rows[0].score,
    85,
  );
  await as("m1");
  await deny(
    "update public.lms_enrollments set course_id=$1 where course_id=$2",
    [c2, c1],
  );
  await db.query(
    "update public.lms_enrollments set status='revoked' where course_id=$1 and student_id=$2",
    [c1, ids.s1],
  );
  await as("s1");
  assert.equal(
    (await db.query("select * from public.lms_lessons")).rows.length,
    0,
  );
  assert.equal(
    (await db.query("select * from public.lms_submissions")).rows.length,
    0,
  );
  await deny("select public.lms_submit_assignment($1,$2,null)", [
    a1,
    "Revoked work",
  ]);
  console.log(
    "PostgreSQL security checks passed: migration, automatic student role, enrollment, draft isolation, course ownership, progress, grade permissions, graded-work lock and access revocation.",
  );
} finally {
  await db.close();
}
