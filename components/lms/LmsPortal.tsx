"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Bell,
  Users,
  FolderOpen,
  ArrowUpRight,
  ArrowLeft,
  Plus,
  LogOut,
  CheckCircle2,
  PlayCircle,
  RefreshCw,
  GraduationCap,
  Pencil,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PROGRAMS } from "@/data/programs";
import { lessonEmbed } from "@/lib/lms-validation";
import type { LmsData, LmsLesson, LmsCourse } from "@/lib/lms-types";
import EditorDialog, { type Editor, type EditorField } from "./EditorDialog";

type Tab =
  | "courses"
  | "sessions"
  | "assignments"
  | "announcements"
  | "resources"
  | "students";
const titleField: EditorField = {
  name: "title",
  label: "Title",
  required: true,
};
const lessonFields: EditorField[] = [
  titleField,
  { name: "module_title", label: "Module", required: true },
  {
    name: "position",
    label: "Lesson order",
    type: "number",
    required: true,
    min: 1,
    max: 10000,
  },
  {
    name: "content",
    label: "Lesson notes",
    type: "textarea",
    maxLength: 30000,
  },
  {
    name: "recording_url",
    label: "Recording link",
    type: "url",
    maxLength: 2000,
  },
];
const sessionFields: EditorField[] = [
  titleField,
  {
    name: "starts_at",
    label: "Start date and time",
    type: "datetime-local",
    required: true,
  },
  {
    name: "duration_minutes",
    label: "Duration in minutes",
    type: "number",
    required: true,
    min: 15,
    max: 480,
  },
  {
    name: "join_url",
    label: "Meeting link",
    type: "url",
    required: true,
    maxLength: 2000,
  },
  { name: "notes", label: "Class notes", type: "textarea" },
];
const date = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50";
const panel = "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6";

class PortalError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}
async function request(
  body?: Record<string, unknown>,
): Promise<LmsData | { success: boolean }> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session)
    throw new PortalError("Please log in to open your learning portal.", 401);
  const response = await fetch("/api/lms", {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new PortalError(
      "Unable to reach the learning portal. Please retry.",
      response.status,
    );
  }
  if (!response.ok)
    throw new PortalError(
      result.error ?? "Unable to complete this request.",
      response.status,
      result.code,
    );
  return result;
}

export default function LmsPortal({
  mode = "auto",
  courseId,
}: {
  mode?: "auto" | "student" | "mentor";
  courseId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<LmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("courses");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    try {
      const result = (await request()) as LmsData;
      if (mode === "auto" && !courseId) {
        router.replace(`/lms/${result.profile.role}`);
        return;
      }
      if (mode !== "auto" && mode !== result.profile.role) {
        router.replace(`/lms/${result.profile.role}`);
        return;
      }
      setData(result);
      setError("");
    } catch (err) {
      if (err instanceof PortalError && err.status === 401) {
        setData(null);
        router.replace("/login?next=/lms");
      } else
        setError(
          err instanceof Error ? err.message : "Unable to load your portal.",
        );
    } finally {
      setLoading(false);
    }
  }, [router, mode, courseId]);

  useEffect(() => {
    let active = true;
    const initial = async () => {
      if (active) await load();
    };
    void initial();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setData(null);
        router.replace("/login?next=/lms");
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [load, router]);

  async function save(body: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      await request(body);
      setMessage("Changes saved.");
      await load();
    } catch (err) {
      if (err instanceof PortalError && err.status === 401)
        router.replace("/login?next=/lms");
      throw err;
    } finally {
      setBusy(false);
    }
  }
  async function quickSave(body: Record<string, unknown>) {
    try {
      await save(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save.");
    }
  }
  async function logout() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      setError("Unable to log out. Please retry.");
      return;
    }
    setData(null);
    router.replace("/login?next=/lms");
  }

  const mentor = data?.profile.role === "mentor";
  const selected = data?.courses.find((course) => course.id === courseId);
  const home = `/lms/${mentor ? "mentor" : "student"}`;
  const visibleCourses =
    data?.courses.filter((course) => !courseId || course.id === courseId) ?? [];
  const courseIds = new Set(visibleCourses.map((course) => course.id));
  const lessons =
    data?.lessons.filter((lesson) => courseIds.has(lesson.course_id)) ?? [];
  const sessions =
    data?.sessions.filter((session) => courseIds.has(session.course_id)) ?? [];
  const assignments =
    data?.assignments.filter((assignment) =>
      courseIds.has(assignment.course_id),
    ) ?? [];
  const announcements =
    data?.announcements.filter((announcement) =>
      courseIds.has(announcement.course_id),
    ) ?? [];
  const resources =
    data?.resources.filter((resource) => courseIds.has(resource.course_id)) ??
    [];
  const enrollments =
    data?.enrollments.filter((enrollment) =>
      courseIds.has(enrollment.course_id),
    ) ?? [];
  const activeStudents = new Set(
    enrollments
      .filter((enrollment) => enrollment.status === "active")
      .map((enrollment) => enrollment.student_id),
  );
  const assignmentIds = new Set(assignments.map((assignment) => assignment.id));
  const submissions =
    data?.submissions.filter((submission) =>
      assignmentIds.has(submission.assignment_id),
    ) ?? [];
  const complete = new Set(
    data?.progress
      .filter((item) => item.student_id === data.profile.id)
      .map((item) => item.lesson_id),
  );
  const publishedLessons = lessons.filter((lesson) => lesson.published);
  const completedCount = publishedLessons.filter((lesson) =>
    complete.has(lesson.id),
  ).length;
  const upcoming = sessions.filter(
    (session) =>
      !session.cancelled &&
      new Date(session.starts_at).getTime() + session.duration_minutes * 60000 >
        now,
  );
  const courseName = (id: string) =>
    data?.courses.find((course) => course.id === id)?.title ?? "Course";
  const studentName = (id: string) => {
    const profile = data?.profiles.find((item) => item.id === id);
    return profile?.full_name || profile?.email || "Student";
  };
  const currentLesson: LmsLesson | undefined = lessons.find(
    (lesson) => lesson.id === lessonId,
  );
  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    {
      id: "courses",
      label: courseId ? "Lessons" : "My Courses",
      icon: BookOpen,
    },
    { id: "sessions", label: "Live Classes", icon: CalendarDays },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    ...(mentor
      ? [{ id: "students" as Tab, label: "Students", icon: Users }]
      : []),
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "resources", label: "Resources", icon: FolderOpen },
  ];
  function open(
    action: string,
    title: string,
    fields: EditorField[],
    values: Record<string, unknown> = {},
  ) {
    setEditor({ action, title, fields, values });
  }
  function create(
    action: string,
    title: string,
    fields: EditorField[],
    defaults: Record<string, unknown> = {},
  ) {
    if (!selected) {
      setError("Open a course first to add content.");
      return;
    }
    open(action, title, fields, { course_id: selected.id, ...defaults });
  }
  function courseProgress(course: LmsCourse, studentId = data?.profile.id) {
    const items =
      data?.lessons.filter(
        (lesson) => lesson.course_id === course.id && lesson.published,
      ) ?? [];
    const ids = new Set(
      data?.progress
        .filter((item) => item.student_id === studentId)
        .map((item) => item.lesson_id),
    );
    return {
      total: items.length,
      done: items.filter((lesson) => ids.has(lesson.id)).length,
    };
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.png"
              alt="NextPeer"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="text-lg font-extrabold">
                Next<span className="text-blue-600">Peer</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Learning Portal
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-xs font-semibold text-slate-500 sm:block"
            >
              Account dashboard
            </Link>
            {data && (
              <>
                <span className="hidden max-w-44 truncate text-sm font-medium sm:block">
                  {data.profile.full_name || data.profile.email}
                </span>
                <button
                  onClick={logout}
                  aria-label="Log out"
                  className={secondary}
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {loading ? (
        <div role="status" className="mx-auto max-w-5xl p-12 text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-blue-600" />
          Loading your learning space…
        </div>
      ) : !data ? (
        <div className="mx-auto max-w-xl px-4 py-20">
          <div className={panel}>
            <GraduationCap size={36} className="mb-5 text-blue-600" />
            <h1 className="text-2xl font-bold">
              Your NextPeer Learning Portal
            </h1>
            <p role="alert" className="mt-4 leading-7 text-slate-600">
              {error || "Opening your portal…"}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={load} className={btn}>
                <RefreshCw size={16} />
                Retry
              </button>
              <Link href="/book-session" className={secondary}>
                Contact NextPeer
              </Link>
            </div>
          </div>
        </div>
      ) : courseId && !selected ? (
        <div className="mx-auto max-w-xl px-4 py-20">
          <div className={panel}>
            <h1 className="text-2xl font-bold">Course unavailable</h1>
            <p className="mt-3 text-slate-600">
              This course is unavailable or you do not have an active
              enrollment.
            </p>
            <Link href={home} className={`${btn} mt-6`}>
              Back to my courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
          <aside className="min-w-0 lg:sticky lg:top-26 lg:self-start">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {mentor ? "Mentor workspace" : "Student workspace"}
            </p>
            <nav
              aria-label="Learning navigation"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col"
            >
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setTab(id);
                    setLessonId(null);
                  }}
                  aria-current={tab === id ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${tab === id ? "bg-blue-600 text-white shadow-md shadow-blue-200/50" : "text-slate-500 hover:bg-white hover:text-blue-600"}`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-8 hidden rounded-2xl border border-blue-100 bg-blue-50 p-4 lg:block">
              <GraduationCap className="text-blue-600" />
              <p className="mt-3 text-sm font-semibold">Learn. Build. Grow.</p>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                {mentor
                  ? "Guide your students from practice to progress."
                  : "Small steps today. Stronger skills tomorrow."}
              </p>
              <Link
                href="/resources"
                className="mt-3 inline-block text-xs font-bold text-blue-600"
              >
                Free study guides →
              </Link>
            </div>
          </aside>
          <div className="min-w-0">
            {courseId && (
              <Link
                href={home}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
              >
                <ArrowLeft size={16} />
                All courses
              </Link>
            )}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white sm:px-8">
              <div className="absolute -right-8 -top-10 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  {mentor ? "Teaching with NextPeer" : "Your learning journey"}
                </p>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {selected?.title ??
                    `${mentor ? "Welcome back" : "Keep moving forward"}, ${(data.profile.full_name || "learner").split(" ")[0]}.`}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  {selected?.description ||
                    (mentor
                      ? "Plan your classes, publish lessons and give your students meaningful feedback."
                      : "Your courses, classes and assignments—all in one place.")}
                </p>
              </div>
            </section>
            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <span>{error}</span>
                <button aria-label="Dismiss error" onClick={() => setError("")}>
                  <X size={16} />
                </button>
              </div>
            )}
            {message && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
              >
                {message}
              </p>
            )}
            <section className="my-6 grid gap-3 sm:grid-cols-3">
              <Stat
                label={mentor ? "Active students" : "My courses"}
                value={mentor ? activeStudents.size : visibleCourses.length}
                icon={mentor ? Users : BookOpen}
              />
              <Stat
                label={mentor ? "Awaiting feedback" : "Lessons completed"}
                value={
                  mentor
                    ? submissions.filter((item) => !item.graded_at).length
                    : `${completedCount}/${publishedLessons.length}`
                }
                icon={ClipboardList}
              />
              <Stat
                label="Upcoming classes"
                value={upcoming.length}
                icon={CalendarDays}
              />
            </section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                {tabs.find((item) => item.id === tab)?.label}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={load}
                  disabled={busy}
                  aria-label="Refresh portal"
                  className={secondary}
                >
                  <RefreshCw size={16} />
                </button>
                {mentor && tab === "courses" && !courseId && (
                  <button
                    className={btn}
                    onClick={() =>
                      open("create_course", "Create a course batch", [
                        {
                          name: "program_slug",
                          label: "Program",
                          type: "select",
                          required: true,
                          options: PROGRAMS.map((item) => ({
                            value: item.slug,
                            label: item.title,
                          })),
                        },
                        { ...titleField, label: "Batch title" },
                        {
                          name: "description",
                          label: "Course description",
                          type: "textarea",
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Create Course
                  </button>
                )}
                {mentor && selected && tab === "courses" && (
                  <>
                    <button
                      className={secondary}
                      onClick={() =>
                        open(
                          "edit_course",
                          "Edit course",
                          [
                            titleField,
                            {
                              name: "description",
                              label: "Course description",
                              type: "textarea",
                            },
                          ],
                          { ...selected },
                        )
                      }
                    >
                      Edit course
                    </button>
                    <button
                      className={secondary}
                      disabled={busy}
                      onClick={() =>
                        quickSave({
                          action: "publish_course",
                          id: selected.id,
                          published: !selected.published,
                        })
                      }
                    >
                      {selected.published
                        ? "Unpublish course"
                        : "Publish course"}
                    </button>
                    <button
                      className={btn}
                      onClick={() =>
                        create("create_lesson", "Add lesson", lessonFields, {
                          module_title: "Core Learning",
                          position: lessons.length + 1,
                        })
                      }
                    >
                      <Plus size={16} />
                      Add Lesson
                    </button>
                  </>
                )}
                {mentor && selected && tab === "sessions" && (
                  <button
                    className={btn}
                    onClick={() =>
                      create(
                        "create_session",
                        "Schedule live class",
                        sessionFields,
                        { duration_minutes: 90 },
                      )
                    }
                  >
                    <Plus size={16} />
                    Schedule Class
                  </button>
                )}
                {mentor && selected && tab === "assignments" && (
                  <button
                    className={btn}
                    onClick={() =>
                      create("create_assignment", "Create assignment", [
                        titleField,
                        {
                          name: "instructions",
                          label: "Instructions",
                          type: "textarea",
                          required: true,
                          maxLength: 12000,
                        },
                        {
                          name: "due_at",
                          label: "Due date and time",
                          type: "datetime-local",
                        },
                        {
                          name: "published",
                          label: "Publish for students now",
                          type: "checkbox",
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Add Assignment
                  </button>
                )}
                {mentor && selected && tab === "students" && (
                  <button
                    className={btn}
                    onClick={() =>
                      create("enroll_student", "Enroll a student", [
                        {
                          name: "email",
                          label: "Confirmed student account email",
                          type: "email",
                          required: true,
                          maxLength: 320,
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Enroll Student
                  </button>
                )}
                {mentor && selected && tab === "announcements" && (
                  <button
                    className={btn}
                    onClick={() =>
                      create("create_announcement", "Post announcement", [
                        titleField,
                        {
                          name: "body",
                          label: "Message",
                          type: "textarea",
                          required: true,
                          maxLength: 12000,
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Post Announcement
                  </button>
                )}
                {mentor && selected && tab === "resources" && (
                  <button
                    className={btn}
                    onClick={() =>
                      create("create_resource", "Add course resource", [
                        titleField,
                        {
                          name: "url",
                          label: "Resource link",
                          type: "url",
                          required: true,
                          maxLength: 2000,
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Add Resource
                  </button>
                )}
              </div>
            </div>
            {mentor && !selected && tab !== "courses" && (
              <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                Open a course from My Courses to manage its content and
                students.
              </p>
            )}
            {tab === "courses" && !courseId && (
              <>
                <label className="sr-only" htmlFor="course-search">
                  Search my courses
                </label>
                <input
                  id="course-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search your courses…"
                  className="mb-5 w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
                {visibleCourses.length === 0 ? (
                  <Empty
                    title={
                      mentor
                        ? "Your teaching workspace is ready"
                        : "Your courses will appear here"
                    }
                    text={
                      mentor
                        ? "Create your first course batch, add lessons and enroll confirmed student accounts."
                        : "NextPeer will add your course after your enrollment is confirmed. You can contact the team if you need help."
                    }
                  >
                    <Link href="/book-session" className={secondary}>
                      Contact NextPeer
                    </Link>
                  </Empty>
                ) : (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {visibleCourses
                      .filter((course) =>
                        course.title
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((course) => {
                        const p = courseProgress(course);
                        const percent = p.total
                          ? Math.round((p.done / p.total) * 100)
                          : 0;
                        return (
                          <article
                            key={course.id}
                            className={`${panel} flex flex-col`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <BookOpen size={22} />
                              </div>
                              <Badge
                                label={
                                  mentor
                                    ? course.published
                                      ? "Published"
                                      : "Draft"
                                    : "Enrolled"
                                }
                              />
                            </div>
                            <h3 className="mt-5 text-lg font-bold">
                              {course.title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {course.description ||
                                "Your practical NextPeer learning program."}
                            </p>
                            {!mentor && (
                              <div className="mt-5">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>
                                    {p.done} of {p.total} lessons
                                  </span>
                                  <span>{percent}%</span>
                                </div>
                                <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <Link
                              href={`/lms/courses/${course.id}`}
                              className={`${btn} mt-6 self-start`}
                            >
                              {mentor
                                ? "Manage Course"
                                : p.done
                                  ? "Continue Learning"
                                  : "Open Course"}
                              <ArrowUpRight size={16} />
                            </Link>
                          </article>
                        );
                      })}
                    {visibleCourses.every(
                      (course) =>
                        !course.title
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                    ) && (
                      <Empty
                        title="No matching courses"
                        text="Try another search."
                      />
                    )}
                  </div>
                )}
              </>
            )}
            {tab === "courses" && selected && (
              <>
                {mentor && !selected.published && (
                  <p className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    This course is a draft. Publish it when you are ready for
                    enrolled students to access it.
                  </p>
                )}
                {lessons.length === 0 ? (
                  <Empty
                    title={
                      mentor
                        ? "Add your first lesson"
                        : "Lessons are being prepared"
                    }
                    text={
                      mentor
                        ? "Add lesson notes and a recording link, then publish the lesson."
                        : "Your mentor will publish the curriculum here."
                    }
                  />
                ) : (
                  <div className="space-y-5">
                    {Array.from(
                      new Set(lessons.map((lesson) => lesson.module_title)),
                    ).map((module) => (
                      <section key={module} className={panel}>
                        <h3 className="mb-4 font-bold">{module}</h3>
                        <div className="space-y-3">
                          {lessons
                            .filter((lesson) => lesson.module_title === module)
                            .map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                              >
                                <button
                                  onClick={() => setLessonId(lesson.id)}
                                  className="flex min-w-0 items-center gap-3 text-left"
                                >
                                  {complete.has(lesson.id) ? (
                                    <CheckCircle2
                                      size={20}
                                      className="shrink-0 text-emerald-600"
                                    />
                                  ) : (
                                    <PlayCircle
                                      size={20}
                                      className="shrink-0 text-blue-600"
                                    />
                                  )}
                                  <span>
                                    <span className="block text-sm font-semibold">
                                      {lesson.title}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      Lesson {lesson.position}
                                      {mentor
                                        ? ` · ${lesson.published ? "Published" : "Draft"}`
                                        : complete.has(lesson.id)
                                          ? " · Completed"
                                          : " · Ready to learn"}
                                    </span>
                                  </span>
                                </button>
                                <div className="flex gap-2">
                                  {mentor && (
                                    <>
                                      <button
                                        className={secondary}
                                        onClick={() =>
                                          open(
                                            "edit_lesson",
                                            "Edit lesson",
                                            lessonFields,
                                            { ...lesson },
                                          )
                                        }
                                        aria-label={`Edit ${lesson.title}`}
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button
                                        disabled={busy}
                                        className={secondary}
                                        onClick={() =>
                                          quickSave({
                                            action: "publish_lesson",
                                            id: lesson.id,
                                            published: !lesson.published,
                                          })
                                        }
                                      >
                                        {lesson.published
                                          ? "Unpublish"
                                          : "Publish"}
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setLessonId(lesson.id)}
                                    className={secondary}
                                  >
                                    Open
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}
            {tab === "sessions" && (
              <>
                <label className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={showPast}
                    onChange={(event) => setShowPast(event.target.checked)}
                    className="accent-blue-600"
                  />
                  Show past and cancelled classes
                </label>
                {sessions.filter(
                  (session) =>
                    showPast || upcoming.some((item) => item.id === session.id),
                ).length === 0 ? (
                  <Empty
                    title="No upcoming classes"
                    text={
                      mentor
                        ? "Open a course to schedule a live class with your meeting link."
                        : "Your mentor will share the next live class here."
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(
                        (session) =>
                          showPast ||
                          upcoming.some((item) => item.id === session.id),
                      )
                      .map((session) => (
                        <article key={session.id} className={panel}>
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-blue-600">
                                {courseName(session.course_id)}
                              </p>
                              <h3 className="mt-2 font-bold">
                                {session.title}
                              </h3>
                              <p className="mt-2 text-sm text-slate-500">
                                {date(session.starts_at)} IST ·{" "}
                                {session.duration_minutes} minutes
                              </p>
                              {session.notes && (
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {session.notes}
                                </p>
                              )}
                            </div>
                            <Badge
                              label={
                                session.cancelled
                                  ? "Cancelled"
                                  : upcoming.some(
                                        (item) => item.id === session.id,
                                      )
                                    ? "Scheduled"
                                    : "Ended"
                              }
                            />
                          </div>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {!session.cancelled && (
                              <a
                                href={session.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={btn}
                              >
                                Open Meeting <ArrowUpRight size={15} />
                              </a>
                            )}
                            {mentor && (
                              <>
                                <button
                                  onClick={() =>
                                    open(
                                      "edit_session",
                                      "Edit live class",
                                      sessionFields,
                                      { ...session },
                                    )
                                  }
                                  className={secondary}
                                >
                                  Edit
                                </button>
                                <button
                                  disabled={busy}
                                  className={secondary}
                                  onClick={() =>
                                    quickSave({
                                      action: "cancel_session",
                                      id: session.id,
                                      cancelled: !session.cancelled,
                                    })
                                  }
                                >
                                  {session.cancelled
                                    ? "Restore class"
                                    : "Cancel class"}
                                </button>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                  </div>
                )}
              </>
            )}
            {tab === "assignments" &&
              (assignments.length === 0 ? (
                <Empty
                  title="No assignments yet"
                  text={
                    mentor
                      ? "Open a course to add an assignment and its assessment instructions."
                      : "Your mentor will publish assignments here."
                  }
                />
              ) : (
                <div className="space-y-5">
                  {assignments.map((assignment) => {
                    const own = submissions.find(
                      (item) =>
                        item.assignment_id === assignment.id &&
                        item.student_id === data.profile.id,
                    );
                    const submitted = submissions.filter(
                      (item) => item.assignment_id === assignment.id,
                    );
                    return (
                      <article key={assignment.id} className={panel}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-blue-600">
                              {courseName(assignment.course_id)}
                            </p>
                            <h3 className="mt-2 text-lg font-bold">
                              {assignment.title}
                            </h3>
                          </div>
                          <Badge
                            label={
                              mentor
                                ? assignment.published
                                  ? "Published"
                                  : "Draft"
                                : own?.graded_at
                                  ? "Reviewed"
                                  : own
                                    ? "Submitted"
                                    : "To do"
                            }
                          />
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {assignment.instructions}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          {assignment.due_at
                            ? `Due ${date(assignment.due_at)} IST`
                            : "No fixed deadline"}
                        </p>
                        {mentor ? (
                          <>
                            <button
                              className={`${secondary} mt-4 mr-2`}
                              onClick={() =>
                                open(
                                  "edit_assignment",
                                  "Edit assignment",
                                  [
                                    titleField,
                                    {
                                      name: "instructions",
                                      label: "Instructions",
                                      type: "textarea",
                                      required: true,
                                      maxLength: 12000,
                                    },
                                    {
                                      name: "due_at",
                                      label: "Due date and time",
                                      type: "datetime-local",
                                    },
                                  ],
                                  { ...assignment },
                                )
                              }
                            >
                              Edit assignment
                            </button>
                            <button
                              disabled={busy}
                              onClick={() =>
                                quickSave({
                                  action: "publish_assignment",
                                  id: assignment.id,
                                  published: !assignment.published,
                                })
                              }
                              className={`${secondary} mt-4`}
                            >
                              {assignment.published ? "Unpublish" : "Publish"}
                            </button>
                            <div className="mt-5 space-y-3">
                              {submitted.length === 0 && (
                                <p className="text-sm text-slate-400">
                                  No submissions yet.
                                </p>
                              )}
                              {submitted.map((submission) => (
                                <div
                                  key={submission.id}
                                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                                >
                                  <div className="flex flex-wrap justify-between gap-3">
                                    <p className="text-sm font-bold">
                                      {studentName(submission.student_id)}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {date(submission.submitted_at)} IST
                                      {assignment.due_at &&
                                      new Date(submission.submitted_at) >
                                        new Date(assignment.due_at)
                                        ? " · Submitted late"
                                        : ""}
                                    </p>
                                  </div>
                                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                    {submission.answer}
                                  </p>
                                  {submission.attachment_url && (
                                    <a
                                      href={submission.attachment_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                                    >
                                      Open submitted work{" "}
                                      <ArrowUpRight size={14} />
                                    </a>
                                  )}
                                  {submission.graded_at && (
                                    <p className="mt-3 text-sm font-semibold text-emerald-700">
                                      Score: {submission.score}/100
                                    </p>
                                  )}
                                  {submission.feedback && (
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                      Feedback: {submission.feedback}
                                    </p>
                                  )}
                                  <button
                                    className={`${secondary} mt-4`}
                                    onClick={() =>
                                      open(
                                        "grade_submission",
                                        "Review submission",
                                        [
                                          {
                                            name: "score",
                                            label: "Score out of 100",
                                            type: "number",
                                            min: 0,
                                            max: 100,
                                            required: true,
                                          },
                                          {
                                            name: "feedback",
                                            label: "Mentor feedback",
                                            type: "textarea",
                                          },
                                        ],
                                        {
                                          id: submission.id,
                                          score: submission.score ?? "",
                                          feedback: submission.feedback ?? "",
                                        },
                                      )
                                    }
                                  >
                                    {submission.graded_at
                                      ? "Update feedback"
                                      : "Review & grade"}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            {own && (
                              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold text-slate-500">
                                  Your submission · {date(own.submitted_at)} IST
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {own.answer}
                                </p>
                                {own.attachment_url && (
                                  <a
                                    href={own.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-sm font-semibold text-blue-600"
                                  >
                                    Open your work →
                                  </a>
                                )}
                                {own.graded_at && (
                                  <p className="mt-3 font-semibold text-emerald-700">
                                    Score: {own.score}/100
                                  </p>
                                )}
                                {own.feedback && (
                                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                    Mentor feedback: {own.feedback}
                                  </p>
                                )}
                              </div>
                            )}
                            {!own?.graded_at && (
                              <button
                                className={`${btn} mt-5`}
                                onClick={() =>
                                  open(
                                    "submit_assignment",
                                    own
                                      ? "Update your submission"
                                      : "Submit assignment",
                                    [
                                      {
                                        name: "answer",
                                        label:
                                          "Your answer or project explanation",
                                        type: "textarea",
                                        required: true,
                                        maxLength: 20000,
                                      },
                                      {
                                        name: "attachment_url",
                                        label:
                                          "Project or document link (optional)",
                                        type: "url",
                                        maxLength: 2000,
                                      },
                                    ],
                                    {
                                      id: assignment.id,
                                      answer: own?.answer ?? "",
                                      attachment_url: own?.attachment_url ?? "",
                                    },
                                  )
                                }
                              >
                                {own ? "Edit submission" : "Submit Work"}
                              </button>
                            )}
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>
              ))}
            {tab === "students" &&
              mentor &&
              (enrollments.length === 0 ? (
                <Empty
                  title="No students enrolled yet"
                  text="Open a course and enroll students using their confirmed account email. They will see the course once you publish it."
                />
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => {
                    const profile = data.profiles.find(
                      (item) => item.id === enrollment.student_id,
                    );
                    const course = data.courses.find(
                      (item) => item.id === enrollment.course_id,
                    );
                    const p = course
                      ? courseProgress(course, enrollment.student_id)
                      : { total: 0, done: 0 };
                    return (
                      <div
                        key={enrollment.id}
                        className={`${panel} flex flex-wrap items-center justify-between gap-4`}
                      >
                        <div>
                          <h3 className="text-sm font-bold">
                            {studentName(enrollment.student_id)}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {profile?.email}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-blue-600">
                            {courseName(enrollment.course_id)} · {p.done}/
                            {p.total} lessons
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            label={
                              enrollment.status === "active"
                                ? "Active"
                                : "Access revoked"
                            }
                          />
                          <button
                            disabled={busy}
                            className={secondary}
                            onClick={() => {
                              if (
                                enrollment.status === "active" &&
                                !window.confirm(
                                  `Revoke ${studentName(enrollment.student_id)}’s access to this course?`,
                                )
                              )
                                return;
                              void quickSave({
                                action: "set_enrollment",
                                id: enrollment.id,
                                status:
                                  enrollment.status === "active"
                                    ? "revoked"
                                    : "active",
                              });
                            }}
                          >
                            {enrollment.status === "active"
                              ? "Revoke access"
                              : "Restore access"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            {tab === "announcements" &&
              (announcements.length === 0 ? (
                <Empty
                  title="No announcements yet"
                  text={
                    mentor
                      ? "Open a course to share an update with enrolled students."
                      : "Course updates from your mentor will appear here."
                  }
                />
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <article key={announcement.id} className={panel}>
                      <p className="text-xs font-semibold text-blue-600">
                        {courseName(announcement.course_id)}
                      </p>
                      <h3 className="mt-2 font-bold">{announcement.title}</h3>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {announcement.body}
                      </p>
                      <p className="mt-4 text-xs text-slate-400">
                        {date(announcement.created_at)} IST
                      </p>
                      {mentor && (
                        <button
                          className={`${secondary} mt-4`}
                          onClick={() =>
                            open(
                              "edit_announcement",
                              "Edit announcement",
                              [
                                titleField,
                                {
                                  name: "body",
                                  label: "Message",
                                  type: "textarea",
                                  required: true,
                                  maxLength: 12000,
                                },
                              ],
                              { ...announcement },
                            )
                          }
                        >
                          Edit announcement
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              ))}
            {tab === "resources" &&
              (resources.length === 0 ? (
                <Empty
                  title="Course materials will appear here"
                  text={
                    mentor
                      ? "Open a course to share notes, slides or practice datasets using HTTPS links."
                      : "Your mentor will share notes and practice files here. You can also use NextPeer’s free study guides."
                  }
                >
                  <Link href="/resources" className={secondary}>
                    Free Study Guides
                  </Link>
                </Empty>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {resources.map((resource) => (
                    <article key={resource.id} className={panel}>
                      <FolderOpen size={22} className="text-blue-600" />
                      <h3 className="mt-3 font-bold">{resource.title}</h3>
                      <p className="mt-2 text-xs text-slate-500">
                        {courseName(resource.course_id)}
                      </p>
                      <div className="mt-5 flex gap-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={btn}
                        >
                          Open Resource <ArrowUpRight size={15} />
                        </a>
                        {mentor && (
                          <button
                            disabled={busy}
                            className={secondary}
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Remove this resource link from the course?",
                                )
                              )
                                void quickSave({
                                  action: "delete_resource",
                                  id: resource.id,
                                });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-400">
              NextPeer Learning Portal · All class times shown in IST ·{" "}
              <Link href="/privacy-policy" className="hover:text-blue-600">
                Privacy
              </Link>
            </footer>
          </div>
        </div>
      )}
      {editor && (
        <EditorDialog
          editor={editor}
          onClose={() => setEditor(null)}
          onSave={save}
        />
      )}
      {currentLesson && (
        <LessonViewer
          lesson={currentLesson}
          completed={complete.has(currentLesson.id)}
          mentor={mentor}
          busy={busy}
          onClose={() => setLessonId(null)}
          onComplete={() =>
            quickSave({
              action: complete.has(currentLesson.id)
                ? "reset_lesson"
                : "complete_lesson",
              id: currentLesson.id,
            })
          }
        />
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof BookOpen;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-extrabold">{value}</p>
      </div>
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <Icon size={21} />
      </div>
    </div>
  );
}
function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
      {label}
    </span>
  );
}
function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <BookOpen size={30} className="mx-auto mb-4 text-blue-400" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
        {text}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

function LessonViewer({
  lesson,
  completed,
  mentor,
  busy,
  onClose,
  onComplete,
}: {
  lesson: LmsLesson;
  completed: boolean;
  mentor: boolean;
  busy: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const embed = lessonEmbed(lesson.recording_url);
  // Native dialog provides focus trapping, Escape handling and focus restoration.
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    dialog?.showModal();
  }, [dialog]);
  return (
    <dialog
      ref={setDialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="lesson-viewer-title"
      className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="text-xs font-semibold text-blue-600">
            {lesson.module_title}
          </p>
          <h2 id="lesson-viewer-title" className="mt-1 text-xl font-bold">
            {lesson.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close lesson"
          className={secondary}
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 sm:p-7">
        {embed && (
          <iframe
            title={`${lesson.title} recording`}
            src={embed}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="mb-5 aspect-video w-full rounded-xl border-0 bg-slate-900"
          />
        )}
        {lesson.recording_url && (
          <a
            href={lesson.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            Open recording in a new tab <ArrowUpRight size={16} />
          </a>
        )}
        {lesson.content && (
          <div className="whitespace-pre-wrap text-sm leading-8 text-slate-700">
            {lesson.content}
          </div>
        )}
        {!lesson.content && !lesson.recording_url && (
          <p className="text-slate-500">Lesson materials are being prepared.</p>
        )}
        {!mentor && (
          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
            <button
              disabled={busy}
              onClick={onComplete}
              className={completed ? secondary : btn}
            >
              <CheckCircle2 size={17} />
              {completed ? "Mark as incomplete" : "Mark Lesson Complete"}
            </button>
            <p className="text-xs text-slate-500">
              Progress is saved to your account. Course certification requires
              mentor review.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}
