import { createClient } from "@supabase/supabase-js";
import { PROGRAMS } from "@/data/programs";
import {
  LmsError,
  text,
  uuid,
  httpsUrl,
  integer,
  boolean,
  timestamp,
} from "@/lib/lms-validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Authorization" },
  });
}
async function authenticate(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ") || header.length < 10)
    throw new LmsError("Please log in to continue.", 401, "UNAUTHENTICATED");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new LmsError(
      "The learning portal is temporarily unavailable.",
      503,
      "LMS_SETUP_REQUIRED",
    );
  const token = header.slice(7);
  const db = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);
  if (error || !user)
    throw new LmsError(
      "Your session expired. Please log in again.",
      401,
      "UNAUTHENTICATED",
    );
  return { db, user };
}
function dbError(error: { code?: string; message: string }) {
  if (["42P01", "42883", "PGRST202", "PGRST205"].includes(error.code ?? ""))
    throw new LmsError(
      "The learning portal is being prepared. Please contact NextPeer for access.",
      503,
      "LMS_SETUP_REQUIRED",
    );
  if (error.code === "42501")
    throw new LmsError(
      "You do not have permission for this action.",
      403,
      "ACCESS_DENIED",
    );
  if (error.code === "P0001") throw new LmsError(error.message, 400);
  if (error.code === "23505")
    throw new LmsError(
      "This record already exists. Refresh and try again.",
      409,
    );
  console.error("LMS database error", error.code);
  throw new LmsError(
    "Unable to save or load this item. Please try again.",
    500,
    "DATABASE_ERROR",
  );
}
function failure(error: unknown) {
  if (error instanceof LmsError)
    return reply({ error: error.message, code: error.code }, error.status);
  console.error(
    "LMS request failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return reply(
    { error: "Unable to complete the request. Please try again." },
    500,
  );
}

export async function GET(request: Request) {
  try {
    const { db, user } = await authenticate(request);
    const ensured = await db.rpc("lms_ensure_profile");
    if (ensured.error) dbError(ensured.error);
    const profileResult = await db
      .from("lms_profiles")
      .select("id,full_name,email,role")
      .eq("id", user.id)
      .single();
    if (profileResult.error) dbError(profileResult.error);
    // Every query uses the caller's token and database row-level policies.
    const keys = [
      "profiles",
      "courses",
      "enrollments",
      "lessons",
      "progress",
      "sessions",
      "assignments",
      "submissions",
      "announcements",
      "resources",
    ] as const;
    const results = await Promise.all([
      db.from("lms_profiles").select("id,full_name,email,role"),
      db
        .from("lms_courses")
        .select("*")
        .order("created_at", { ascending: false }),
      db
        .from("lms_enrollments")
        .select("*")
        .order("created_at", { ascending: false }),
      db.from("lms_lessons").select("*").order("position"),
      db.from("lms_progress").select("*"),
      db.from("lms_sessions").select("*").order("starts_at"),
      db
        .from("lms_assignments")
        .select("*")
        .order("created_at", { ascending: false }),
      db
        .from("lms_submissions")
        .select("*")
        .order("submitted_at", { ascending: false }),
      db
        .from("lms_announcements")
        .select("*")
        .order("created_at", { ascending: false }),
      db
        .from("lms_resources")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    for (const result of results) if (result.error) dbError(result.error);
    return reply({
      profile: profileResult.data,
      ...Object.fromEntries(
        results.map((result, i) => [keys[i], result.data ?? []]),
      ),
    });
  } catch (error) {
    return failure(error);
  }
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new LmsError("Send JSON data.");
  const reader = request.body?.getReader();
  if (!reader) throw new LmsError("Request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 64000) {
      await reader.cancel();
      throw new LmsError("The submission is too large.", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new LmsError("Invalid JSON data.");
  }
}

export async function POST(request: Request) {
  try {
    const { db, user } = await authenticate(request);
    const body = await readBody(request);
    const action = text(body.action, "Action", 60);
    const id = () => uuid(body.id);
    const course = () => uuid(body.course_id, "course");
    let result;
    switch (action) {
      case "create_course": {
        const program = text(body.program_slug, "Program", 120);
        if (!PROGRAMS.some((item) => item.slug === program))
          throw new LmsError("Choose an available program.");
        result = await db
          .from("lms_courses")
          .insert({
            mentor_id: user.id,
            program_slug: program,
            title: text(body.title, "Course title"),
            description: text(body.description, "Description", 6000, false),
          })
          .select("id")
          .single();
        break;
      }
      case "publish_course":
        result = await db
          .from("lms_courses")
          .update({ published: boolean(body.published) })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "edit_course":
        result = await db
          .from("lms_courses")
          .update({
            title: text(body.title, "Course title"),
            description: text(body.description, "Description", 6000, false),
          })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "create_lesson":
      case "edit_lesson": {
        const content = text(body.content, "Lesson notes", 30000, false);
        const recording = httpsUrl(body.recording_url, false);
        if (!content && !recording)
          throw new LmsError("Add lesson notes or a recording link.");
        const values = {
          title: text(body.title, "Lesson title"),
          module_title: text(body.module_title, "Module title"),
          content,
          recording_url: recording,
          position: integer(body.position, "Lesson order", 1, 10000),
        };
        result =
          action === "create_lesson"
            ? await db
                .from("lms_lessons")
                .insert({ ...values, course_id: course(), published: false })
                .select("id")
                .single()
            : await db
                .from("lms_lessons")
                .update(values)
                .eq("id", id())
                .select("id")
                .single();
        break;
      }
      case "publish_lesson":
        result = await db
          .from("lms_lessons")
          .update({ published: boolean(body.published) })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "complete_lesson":
        result = await db
          .from("lms_progress")
          .upsert(
            { student_id: user.id, lesson_id: id() },
            { onConflict: "student_id,lesson_id", ignoreDuplicates: true },
          );
        break;
      case "reset_lesson":
        result = await db
          .from("lms_progress")
          .delete()
          .eq("student_id", user.id)
          .eq("lesson_id", id());
        break;
      case "create_session":
        result = await db
          .from("lms_sessions")
          .insert({
            course_id: course(),
            title: text(body.title, "Class title"),
            starts_at: timestamp(body.starts_at),
            duration_minutes: integer(
              body.duration_minutes,
              "Duration",
              15,
              480,
            ),
            join_url: httpsUrl(body.join_url),
            notes: text(body.notes, "Class notes", 6000, false),
          })
          .select("id")
          .single();
        break;
      case "edit_session":
        result = await db
          .from("lms_sessions")
          .update({
            title: text(body.title, "Class title"),
            starts_at: timestamp(body.starts_at),
            duration_minutes: integer(
              body.duration_minutes,
              "Duration",
              15,
              480,
            ),
            join_url: httpsUrl(body.join_url),
            notes: text(body.notes, "Class notes", 6000, false),
          })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "cancel_session":
        result = await db
          .from("lms_sessions")
          .update({ cancelled: boolean(body.cancelled) })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "create_assignment":
        result = await db
          .from("lms_assignments")
          .insert({
            course_id: course(),
            title: text(body.title, "Assignment title"),
            instructions: text(body.instructions, "Instructions", 12000),
            due_at: timestamp(body.due_at, false),
            published: boolean(body.published),
          })
          .select("id")
          .single();
        break;
      case "publish_assignment":
        result = await db
          .from("lms_assignments")
          .update({ published: boolean(body.published) })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "edit_assignment":
        result = await db
          .from("lms_assignments")
          .update({
            title: text(body.title, "Assignment title"),
            instructions: text(body.instructions, "Instructions", 12000),
            due_at: timestamp(body.due_at, false),
          })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "submit_assignment":
        result = await db.rpc("lms_submit_assignment", {
          p_assignment: id(),
          p_answer: text(body.answer, "Answer", 20000),
          p_url: httpsUrl(body.attachment_url, false),
        });
        break;
      case "grade_submission":
        result = await db.rpc("lms_grade_submission", {
          p_submission: id(),
          p_score: integer(body.score, "Score", 0, 100),
          p_feedback: text(body.feedback, "Feedback", 6000, false),
        });
        break;
      case "enroll_student":
        result = await db.rpc("lms_enroll_student", {
          p_course: course(),
          p_email: text(body.email, "Student email", 320),
        });
        break;
      case "set_enrollment": {
        const status = body.status;
        if (status !== "active" && status !== "revoked")
          throw new LmsError("Invalid enrollment status.");
        result = await db
          .from("lms_enrollments")
          .update({ status })
          .eq("id", id())
          .select("id")
          .single();
        break;
      }
      case "create_announcement":
        result = await db
          .from("lms_announcements")
          .insert({
            course_id: course(),
            title: text(body.title, "Announcement title"),
            body: text(body.body, "Announcement", 12000),
          })
          .select("id")
          .single();
        break;
      case "edit_announcement":
        result = await db
          .from("lms_announcements")
          .update({
            title: text(body.title, "Announcement title"),
            body: text(body.body, "Announcement", 12000),
          })
          .eq("id", id())
          .select("id")
          .single();
        break;
      case "create_resource":
        result = await db
          .from("lms_resources")
          .insert({
            course_id: course(),
            title: text(body.title, "Resource title"),
            url: httpsUrl(body.url),
          })
          .select("id")
          .single();
        break;
      case "delete_resource":
        result = await db
          .from("lms_resources")
          .delete()
          .eq("id", id())
          .select("id")
          .single();
        break;
      default:
        throw new LmsError("Unknown action.");
    }
    if (result.error) {
      if (result.error.code === "PGRST116")
        throw new LmsError(
          "Item unavailable or access denied.",
          403,
          "ACCESS_DENIED",
        );
      dbError(result.error);
    }
    return reply({ success: true, data: result.data });
  } catch (error) {
    return failure(error);
  }
}
