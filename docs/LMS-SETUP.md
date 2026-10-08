# NextPeer Student & Mentor LMS

The portal is available at `/lms`. It uses your existing Supabase login and automatically opens the student or mentor workspace for the signed-in account.

## Activate the database once

1. Open the Supabase project used by nextpeer.in.
2. Open **SQL Editor**, create a new query, and paste the complete contents of [`supabase/migrations/20261008_lms_portal.sql`](../supabase/migrations/20261008_lms_portal.sql).
3. Run the query once. It creates the LMS tables, access policies and protected functions in one transaction. The existing learning and HR tables are preserved. Do not run the migration again after it succeeds.
4. Confirm Vercel has the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` values for this project. No new service-role key is needed by the LMS.

You can check the migration with:

```sql
select to_regclass('public.lms_courses') as courses,
       to_regclass('public.lms_submissions') as submissions;
```

Both values should be populated. Before activation, the portal displays a setup message instead of pretending to save data.

## Give a verified mentor access

Ask the mentor to create a normal NextPeer account and confirm their email. In the Supabase SQL Editor, replace `MENTOR_EMAIL_HERE` with that verified account's email and run:

```sql
insert into public.lms_profiles (id, full_name, email, role)
select id, coalesce(raw_user_meta_data->>'full_name', ''), email, 'mentor'
from auth.users
where lower(email) = lower('MENTOR_EMAIL_HERE')
  and email_confirmed_at is not null
on conflict (id) do update set role = 'mentor';

select id, email, role
from public.lms_profiles
where lower(email) = lower('MENTOR_EMAIL_HERE');
```

The result must show the intended email and `mentor`. If there is no result, confirm the email and account before retrying. Only a trusted database administrator grants this role; changing signup metadata does not grant mentor access.

The mentor can now log in and open `/lms/mentor`. Students open `/lms/student`. `/lms` chooses the correct workspace automatically.

## Mentor workflow

1. Create a course batch and select its NextPeer program.
2. Open **Manage Course**. Add lesson notes and HTTPS recording links. Lessons start as drafts; publish the lessons you want students to see.
3. Use **Students → Enroll Student** with the student's confirmed NextPeer account email. Enrollment is assigned by the mentor; students cannot enroll themselves into paid course content.
4. Publish the course to make it visible to its active enrollments.
5. Use **Live Classes** to create or edit meeting schedules. Enter times in IST. Supply your existing Meet, Zoom or other HTTPS meeting link.
6. Add assignments with instructions and an optional deadline. Review submissions and give a score out of 100 and written feedback.
7. Post announcements and resource links for that course. Revoke or restore an enrollment's access when necessary.

Each course belongs to one mentor. A mentor's dashboard includes only their courses and enrolled students. Teaching-role accounts are distinct from student-role accounts.

## Student workflow

1. Sign up and confirm the email used for enrollment.
2. Log in through **LMS Portal** and open your course.
3. Read lesson notes or watch recordings. YouTube and standard Vimeo links can play inside the portal; other providers open in a new tab.
4. Mark a lesson complete to save progress to your account. Progress can be marked incomplete if you want to revisit a lesson.
5. Open scheduled meeting links, read course updates and access learning materials.
6. Submit assignment text and an optional HTTPS document/project link. Make the shared document accessible to your mentor.
7. Revise work before grading. Once graded, the submission is locked and the mentor's feedback appears in your portal.

Deadlines are displayed for planning; late work is accepted and the submission timestamp is shown to the mentor. All displayed class/deadline times are IST. Lesson completion records learning progress; certification still requires the programme's assessment and mentor review.

## Existing enrollments

The new LMS uses separate `lms_` tables so it does not overwrite the existing `/dashboard` and `/learn` records. Old courses and enrollments are not silently imported. Mentors should create the intended batch and enroll existing confirmed student accounts. The account dashboard remains linked from the LMS.

## Checks before inviting students

- Confirm a mentor can create a batch, publish a lesson and enroll a confirmed student account.
- Confirm that student sees the published course and lesson after refreshing.
- Save lesson completion, sign out and back in, and confirm progress remains saved.
- Submit an assignment, grade it as the assigned mentor, and check the student's feedback view.
- Check the meeting and document links with the student account.
- Revoke a test enrollment and confirm its course access is removed.

## Development validation

```sh
npm run test:lms
npm run build
```

The security tests apply the migration to an isolated PostgreSQL engine, simulate authenticated roles, and test both allowed and denied operations. They do not connect to or change the production Supabase database. A production build also needs the site's existing Supabase environment variables.

Database reference: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [database functions](https://supabase.com/docs/guides/database/functions).
