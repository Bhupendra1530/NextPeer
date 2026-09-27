"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderKanban,
  GraduationCap,
  Lock,
  LogOut,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Course = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  duration: string | null;
};

type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  enrolled_at: string;
};

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  lesson_order: number;
  duration_minutes: number;
  is_preview: boolean;
};

type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  module_order: number;
  lessons: Lesson[];
};

type ProgressRow = {
  id: string;
  lesson_id: string;
  user_id: string;
  completed: boolean;
  completed_at: string | null;
};

export default function CourseLearningPage() {
  const router = useRouter();
  const params = useParams();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : (params.courseId as string);

  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------
        // 1. GET LOGGED-IN USER
        // ------------------------------------------------

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        if (!mounted) return;

        setUser(user);

        // ------------------------------------------------
        // 2. VERIFY ACTIVE ENROLLMENT
        // ------------------------------------------------

        const { data: enrollmentData, error: enrollmentError } =
          await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .eq("status", "active")
            .maybeSingle();

        if (enrollmentError) {
          throw enrollmentError;
        }

        if (!enrollmentData) {
          if (mounted) {
            setError(
              "You do not have an active enrollment for this program."
            );
          }
          return;
        }

        // ------------------------------------------------
        // 3. LOAD COURSE
        // ------------------------------------------------

        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, slug, description, duration")
          .eq("id", courseId)
          .single();

        if (courseError) {
          throw courseError;
        }

        // ------------------------------------------------
        // 4. LOAD MODULES
        // ------------------------------------------------

        const { data: moduleData, error: moduleError } = await supabase
          .from("course_modules")
          .select(
            "id, course_id, title, description, module_order"
          )
          .eq("course_id", courseId)
          .order("module_order", { ascending: true });

        if (moduleError) {
          throw moduleError;
        }

        // ------------------------------------------------
        // 5. LOAD LESSONS FOR EACH MODULE
        // ------------------------------------------------

        const moduleIds = (moduleData ?? []).map((module) => module.id);

        let lessonData: Lesson[] = [];

        if (moduleIds.length > 0) {
          const { data, error: lessonError } = await supabase
            .from("lessons")
            .select(
              "id, module_id, title, description, video_url, lesson_order, duration_minutes, is_preview"
            )
            .in("module_id", moduleIds)
            .order("lesson_order", { ascending: true });

          if (lessonError) {
            throw lessonError;
          }

          lessonData = (data ?? []) as Lesson[];
        }

        const modulesWithLessons: CourseModule[] = (moduleData ?? []).map(
          (module) => ({
            ...module,
            lessons: lessonData
              .filter((lesson) => lesson.module_id === module.id)
              .sort((a, b) => a.lesson_order - b.lesson_order),
          })
        );

        // ------------------------------------------------
        // 6. LOAD STUDENT PROGRESS
        // ------------------------------------------------

        const allLessonIds = lessonData.map((lesson) => lesson.id);

        let progressData: ProgressRow[] = [];

        if (allLessonIds.length > 0) {
          const { data, error: progressError } = await supabase
            .from("lesson_progress")
            .select(
              "id, lesson_id, user_id, completed, completed_at"
            )
            .eq("user_id", user.id)
            .in("lesson_id", allLessonIds);

          if (progressError) {
            throw progressError;
          }

          progressData = (data ?? []) as ProgressRow[];
        }

        const completedIds = new Set(
          progressData
            .filter((row) => row.completed)
            .map((row) => row.lesson_id)
        );

        if (!mounted) return;

        setEnrollment(enrollmentData as Enrollment);
        setCourse(courseData as Course);
        setModules(modulesWithLessons);
        setCompletedLessonIds(completedIds);
      } catch (err) {
        console.error("Learning page error:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this program."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (courseId) {
      loadCourse();
    }

    return () => {
      mounted = false;
    };
  }, [courseId, router]);

  // ------------------------------------------------
  // COURSE STATS
  // ------------------------------------------------

  const allLessons = useMemo(
    () => modules.flatMap((module) => module.lessons),
    [modules]
  );

  const totalLessons = allLessons.length;

  const completedLessons = allLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id)
  ).length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  const courseCompleted =
    totalLessons > 0 && completedLessons === totalLessons;

  // ------------------------------------------------
  // LESSON UNLOCK LOGIC
  // ------------------------------------------------

  const isLessonUnlocked = (lessonId: string) => {
    const lessonIndex = allLessons.findIndex(
      (lesson) => lesson.id === lessonId
    );

    if (lessonIndex === -1) return false;

    // First lesson always available
    if (lessonIndex === 0) return true;

    // Completed lessons stay available
    if (completedLessonIds.has(lessonId)) return true;

    // Next lesson unlocks when previous lesson is completed
    const previousLesson = allLessons[lessonIndex - 1];

    return completedLessonIds.has(previousLesson.id);
  };

  // ------------------------------------------------
  // MARK LESSON COMPLETE
  // ------------------------------------------------

  const markLessonComplete = async (lesson: Lesson) => {
    if (!user) return;

    if (!isLessonUnlocked(lesson.id)) return;

    if (completedLessonIds.has(lesson.id)) return;

    try {
      setProgressLoading(lesson.id);
      setError("");

      const completedAt = new Date().toISOString();

      const { error: progressError } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: lesson.id,
            completed: true,
            completed_at: completedAt,
            updated_at: completedAt,
          },
          {
            onConflict: "user_id,lesson_id",
          }
        );

      if (progressError) {
        throw progressError;
      }

      setCompletedLessonIds((previous) => {
        const updated = new Set(previous);
        updated.add(lesson.id);
        return updated;
      });
    } catch (err) {
      console.error("Progress update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update lesson progress."
      );
    } finally {
      setProgressLoading(null);
    }
  };

  // ------------------------------------------------
  // START / CONTINUE COURSE
  // ------------------------------------------------

  const handleStartLearning = () => {
    if (allLessons.length === 0) return;

    const nextLesson =
      allLessons.find(
        (lesson) => !completedLessonIds.has(lesson.id)
      ) ?? allLessons[0];

    const element = document.getElementById(
      `lesson-${nextLesson.id}`
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your learning space...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // ERROR / NO ENROLLMENT
  // ------------------------------------------------

  if (error && (!course || !enrollment)) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Lock size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Program unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              {error}
            </p>

            <Link
              href="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!course || !enrollment) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP NAVIGATION */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:flex">
              <CheckCircle2 size={15} />
              Active Enrollment
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* COURSE HERO */}

        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
          <div className="relative px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100">
                <GraduationCap size={15} />
                NextPeer Learning Program
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {course.description ||
                  "Build practical, industry-relevant skills through structured learning, projects and assessments."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <Clock3
                    size={17}
                    className="text-blue-300"
                  />

                  {course.duration || "3 Months"}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <BookOpen
                    size={17}
                    className="text-blue-300"
                  />

                  {modules.length} Modules
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <PlayCircle
                    size={17}
                    className="text-blue-300"
                  />

                  {totalLessons} Lessons
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <FolderKanban
                    size={17}
                    className="text-blue-300"
                  />

                  Practical Projects
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATABASE ERROR */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* PROGRESS CARDS */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Course Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {progress}%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Trophy size={23} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Lessons Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completedLessons}

                  <span className="text-lg font-semibold text-slate-400">
                    /{totalLessons}
                  </span>
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen size={23} />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Complete lessons to increase your progress.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Certificate
                </p>

                <p
                  className={`mt-2 text-xl font-bold ${
                    courseCompleted
                      ? "text-green-600"
                      : "text-slate-900"
                  }`}
                >
                  {courseCompleted
                    ? "Eligible"
                    : "Locked"}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  courseCompleted
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {courseCompleted ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <Lock size={22} />
                )}
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {courseCompleted
                ? "You completed all lessons in this program."
                : "Complete the program requirements to unlock your certificate."}
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_330px]">
          {/* CURRICULUM */}

          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Course Curriculum
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Your learning journey
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete each lesson to unlock the next one.
              </p>
            </div>

            {modules.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <BookOpen
                  size={30}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 font-bold text-slate-900">
                  Curriculum coming soon
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Modules haven't been added to this program yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex gap-4 p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                        {module.module_order}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {module.title}
                            </h3>

                            {module.description && (
                              <p className="mt-1 text-sm leading-6 text-slate-500">
                                {module.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {module.lessons.length} Lessons
                          </span>
                        </div>

                        <div className="mt-5 space-y-3">
                          {module.lessons.map((lesson) => {
                            const completed =
                              completedLessonIds.has(
                                lesson.id
                              );

                            const unlocked =
                              isLessonUnlocked(lesson.id);

                            const updating =
                              progressLoading === lesson.id;

                            return (
                              <div
                                id={`lesson-${lesson.id}`}
                                key={lesson.id}
                                className={`rounded-xl border px-4 py-4 transition ${
                                  completed
                                    ? "border-green-200 bg-green-50/60"
                                    : unlocked
                                    ? "border-blue-100 bg-blue-50/40"
                                    : "border-slate-100 bg-slate-50"
                                }`}
                              >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <div className="mt-0.5 shrink-0">
                                      {completed ? (
                                        <CheckCircle2
                                          size={21}
                                          className="text-green-600"
                                        />
                                      ) : unlocked ? (
                                        <PlayCircle
                                          size={21}
                                          className="text-blue-600"
                                        />
                                      ) : (
                                        <Lock
                                          size={18}
                                          className="text-slate-400"
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-800">
                                          {lesson.title}
                                        </p>

                                        {lesson.is_preview && (
                                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                            Preview
                                          </span>
                                        )}
                                      </div>

                                      {lesson.description && (
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                          {lesson.description}
                                        </p>
                                      )}

                                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <span>
                                          Lesson{" "}
                                          {lesson.lesson_order}
                                        </span>

                                        {lesson.duration_minutes >
                                          0 && (
                                          <span className="flex items-center gap-1">
                                            <Clock3 size={13} />

                                            {
                                              lesson.duration_minutes
                                            }{" "}
                                            min
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {completed ? (
                                      <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                                        <CheckCircle2
                                          size={15}
                                        />
                                        Completed
                                      </span>
                                    ) : unlocked ? (
                                     <Link
  href={`/learn/${courseId}/lesson/${lesson.id}`}
  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
>
  Start Lesson

  <ChevronRight size={15} />
</Link>
                                    ) : (
                                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
                                        <Lock size={14} />
                                        Locked
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SIDEBAR */}

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PlayCircle size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {completedLessons === 0
                  ? "Start learning"
                  : courseCompleted
                  ? "Program completed"
                  : "Continue learning"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {courseCompleted
                  ? "You've completed every lesson in this program."
                  : "Continue through your curriculum and your progress will be saved automatically."}
              </p>

              {!courseCompleted && totalLessons > 0 && (
                <button
                  type="button"
                  onClick={handleStartLearning}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {completedLessons === 0
                    ? "Start Module 1"
                    : "Continue Learning"}

                  <ChevronRight size={18} />
                </button>
              )}

              <div className="my-6 border-t border-slate-100" />

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Program details
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Duration
                  </span>

                  <span className="font-semibold text-slate-800">
                    {course.duration || "3 Months"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Modules
                  </span>

                  <span className="font-semibold text-slate-800">
                    {modules.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Lessons
                  </span>

                  <span className="font-semibold text-slate-800">
                    {totalLessons}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Completed
                  </span>

                  <span className="font-semibold text-blue-600">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Enrollment
                  </span>

                  <span className="font-semibold capitalize text-green-600">
                    {enrollment.status}
                  </span>
                </div>
              </div>

              <div
                className={`mt-6 rounded-xl p-4 ${
                  courseCompleted
                    ? "bg-green-50"
                    : "bg-blue-50"
                }`}
              >
                <div className="flex gap-3">
                  <GraduationCap
                    size={21}
                    className={`mt-0.5 shrink-0 ${
                      courseCompleted
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      NextPeer Certificate
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {courseCompleted
                        ? "You have completed the lesson requirement for this program."
                        : "Complete all lessons to become eligible for certification."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
