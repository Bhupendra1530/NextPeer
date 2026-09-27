"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Lock,
  LogOut,
  PlayCircle,
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

type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  module_order: number;
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

type ProgressRow = {
  id: string;
  lesson_id: string;
  user_id: string;
  completed: boolean;
  completed_at: string | null;
};

type LessonWithModule = Lesson & {
  module: CourseModule;
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : (params.courseId as string);

  const lessonId = Array.isArray(params.lessonId)
    ? params.lessonId[0]
    : (params.lessonId as string);

  const [user, setUser] = useState<User | null>(null);

  const [course, setCourse] = useState<Course | null>(null);

  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [lesson, setLesson] =
    useState<LessonWithModule | null>(null);

  const [allLessons, setAllLessons] =
    useState<LessonWithModule[]>([]);

  const [completedLessonIds, setCompletedLessonIds] =
    useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ------------------------------------------------
  // LOAD LESSON PAGE
  // ------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadLessonPage = async () => {
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

        const {
          data: enrollmentData,
          error: enrollmentError,
        } = await supabase
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

        const {
          data: courseData,
          error: courseError,
        } = await supabase
          .from("courses")
          .select(
            "id, title, slug, description, duration"
          )
          .eq("id", courseId)
          .single();

        if (courseError) {
          throw courseError;
        }

        // ------------------------------------------------
        // 4. LOAD COURSE MODULES
        // ------------------------------------------------

        const {
          data: moduleData,
          error: moduleError,
        } = await supabase
          .from("course_modules")
          .select(
            "id, course_id, title, description, module_order"
          )
          .eq("course_id", courseId)
          .order("module_order", {
            ascending: true,
          });

        if (moduleError) {
          throw moduleError;
        }

        const modules =
          (moduleData ?? []) as CourseModule[];

        const moduleIds = modules.map(
          (module) => module.id
        );

        if (moduleIds.length === 0) {
          throw new Error(
            "No modules were found for this program."
          );
        }

        // ------------------------------------------------
        // 5. LOAD ALL LESSONS
        // ------------------------------------------------

        const {
          data: lessonData,
          error: lessonsError,
        } = await supabase
          .from("lessons")
          .select(
            "id, module_id, title, description, video_url, lesson_order, duration_minutes, is_preview"
          )
          .in("module_id", moduleIds)
          .order("lesson_order", {
            ascending: true,
          });

        if (lessonsError) {
          throw lessonsError;
        }

        const rawLessons =
          (lessonData ?? []) as Lesson[];

        // ------------------------------------------------
        // 6. COMBINE LESSONS WITH MODULES
        // ------------------------------------------------

        const lessonsWithModules: LessonWithModule[] =
          [];

        modules
          .sort(
            (a, b) =>
              a.module_order - b.module_order
          )
          .forEach((module) => {
            const moduleLessons = rawLessons
              .filter(
                (item) =>
                  item.module_id === module.id
              )
              .sort(
                (a, b) =>
                  a.lesson_order -
                  b.lesson_order
              );

            moduleLessons.forEach((item) => {
              lessonsWithModules.push({
                ...item,
                module,
              });
            });
          });

        // ------------------------------------------------
        // 7. FIND CURRENT LESSON
        // ------------------------------------------------

        const currentLesson =
          lessonsWithModules.find(
            (item) => item.id === lessonId
          );

        if (!currentLesson) {
          throw new Error(
            "This lesson could not be found."
          );
        }

        // ------------------------------------------------
        // 8. LOAD STUDENT PROGRESS
        // ------------------------------------------------

        const allLessonIds =
          lessonsWithModules.map(
            (item) => item.id
          );

        let progressData: ProgressRow[] = [];

        if (allLessonIds.length > 0) {
          const {
            data,
            error: progressError,
          } = await supabase
            .from("lesson_progress")
            .select(
              "id, lesson_id, user_id, completed, completed_at"
            )
            .eq("user_id", user.id)
            .in("lesson_id", allLessonIds);

          if (progressError) {
            throw progressError;
          }

          progressData =
            (data ?? []) as ProgressRow[];
        }

        const completedIds = new Set(
          progressData
            .filter((row) => row.completed)
            .map((row) => row.lesson_id)
        );

        // ------------------------------------------------
        // 9. CHECK WHETHER CURRENT LESSON IS UNLOCKED
        // ------------------------------------------------

        const currentIndex =
          lessonsWithModules.findIndex(
            (item) =>
              item.id === currentLesson.id
          );

        let unlocked = false;

        // First lesson always unlocked
        if (currentIndex === 0) {
          unlocked = true;
        }

        // Completed lesson stays unlocked
        if (
          completedIds.has(currentLesson.id)
        ) {
          unlocked = true;
        }

        // Otherwise previous lesson must be completed
        if (currentIndex > 0) {
          const previousLesson =
            lessonsWithModules[
              currentIndex - 1
            ];

          if (
            completedIds.has(
              previousLesson.id
            )
          ) {
            unlocked = true;
          }
        }

        if (!unlocked) {
          if (mounted) {
            setError(
              "Complete the previous lesson before opening this lesson."
            );
          }

          return;
        }

        if (!mounted) return;

        setEnrollment(
          enrollmentData as Enrollment
        );

        setCourse(courseData as Course);

        setAllLessons(
          lessonsWithModules
        );

        setLesson(currentLesson);

        setCompletedLessonIds(
          completedIds
        );
      } catch (err) {
        console.error(
          "Lesson page error:",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this lesson."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (courseId && lessonId) {
      loadLessonPage();
    }

    return () => {
      mounted = false;
    };
  }, [courseId, lessonId, router]);

  // ------------------------------------------------
  // CURRENT LESSON INDEX
  // ------------------------------------------------

  const currentLessonIndex =
    useMemo(() => {
      if (!lesson) return -1;

      return allLessons.findIndex(
        (item) =>
          item.id === lesson.id
      );
    }, [allLessons, lesson]);

  // ------------------------------------------------
  // PREVIOUS LESSON
  // ------------------------------------------------

  const previousLesson =
    currentLessonIndex > 0
      ? allLessons[
          currentLessonIndex - 1
        ]
      : null;

  // ------------------------------------------------
  // NEXT LESSON
  // ------------------------------------------------

  const nextLesson =
    currentLessonIndex >= 0 &&
    currentLessonIndex <
      allLessons.length - 1
      ? allLessons[
          currentLessonIndex + 1
        ]
      : null;

  // ------------------------------------------------
  // CURRENT LESSON COMPLETED?
  // ------------------------------------------------

  const lessonCompleted =
    lesson
      ? completedLessonIds.has(
          lesson.id
        )
      : false;

  // ------------------------------------------------
  // COURSE PROGRESS
  // ------------------------------------------------

  const completedCount =
    allLessons.filter((item) =>
      completedLessonIds.has(item.id)
    ).length;

  const progress =
    allLessons.length === 0
      ? 0
      : Math.round(
          (completedCount /
            allLessons.length) *
            100
        );

  // ------------------------------------------------
  // MARK LESSON COMPLETE
  // ------------------------------------------------

  const markLessonComplete =
    async () => {
      if (!user || !lesson) return;

      if (lessonCompleted) {
        if (nextLesson) {
          router.push(
            `/learn/${courseId}/lesson/${nextLesson.id}`
          );
        }

        return;
      }

      try {
        setSaving(true);
        setError("");

        const completedAt =
          new Date().toISOString();

        const {
          error: progressError,
        } = await supabase
          .from("lesson_progress")
          .upsert(
            {
              user_id: user.id,
              lesson_id: lesson.id,
              completed: true,
              completed_at:
                completedAt,
              updated_at:
                completedAt,
            },
            {
              onConflict:
                "user_id,lesson_id",
            }
          );

        if (progressError) {
          throw progressError;
        }

        setCompletedLessonIds(
          (previous) => {
            const updated =
              new Set(previous);

            updated.add(
              lesson.id
            );

            return updated;
          }
        );

        // Automatically open next lesson
        if (nextLesson) {
          router.push(
            `/learn/${courseId}/lesson/${nextLesson.id}`
          );
        }
      } catch (err) {
        console.error(
          "Lesson completion error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to save lesson progress."
        );
      } finally {
        setSaving(false);
      }
    };

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const handleLogout =
    async () => {
      await supabase.auth.signOut();

      router.push("/login");

      router.refresh();
    };

  // ------------------------------------------------
  // VIDEO EMBED HELPER
  // ------------------------------------------------

  const getVideoEmbedUrl = (
    url: string | null
  ) => {
    if (!url) return null;

    try {
      // YouTube normal URL
      if (
        url.includes(
          "youtube.com/watch"
        )
      ) {
        const parsed =
          new URL(url);

        const videoId =
          parsed.searchParams.get(
            "v"
          );

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // YouTube short URL
      if (
        url.includes("youtu.be/")
      ) {
        const parsed =
          new URL(url);

        const videoId =
          parsed.pathname.replace(
            "/",
            ""
          );

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Already embed URL
      if (
        url.includes(
          "youtube.com/embed/"
        )
      ) {
        return url;
      }

      // Vimeo
      if (
        url.includes("vimeo.com/")
      ) {
        const parsed =
          new URL(url);

        const videoId =
          parsed.pathname
            .split("/")
            .filter(Boolean)[0];

        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }

      return url;
    } catch {
      return url;
    }
  };

  // ------------------------------------------------
  // LOADING SCREEN
  // ------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[75vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading lesson...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // ERROR / LOCKED LESSON
  // ------------------------------------------------

  if (
    error &&
    (!lesson ||
      !course ||
      !enrollment)
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Lock size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Lesson unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              {error}
            </p>

            <Link
              href={`/learn/${courseId}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={17} />

              Return to Course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (
    !lesson ||
    !course ||
    !enrollment
  ) {
    return null;
  }

  const videoUrl =
    getVideoEmbedUrl(
      lesson.video_url
    );

  // ------------------------------------------------
  // PAGE
  // ------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP NAVIGATION */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/learn/${courseId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />

            Course
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:flex">
              <CheckCircle2
                size={15}
              />

              Active Enrollment
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <LogOut
                size={16}
              />

              <span className="hidden sm:inline">
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}

        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href={`/learn/${courseId}`}
            className="font-medium transition hover:text-blue-600"
          >
            {course.title}
          </Link>

          <ChevronRight
            size={15}
          />

          <span>
            Module{" "}
            {
              lesson.module
                .module_order
            }
          </span>

          <ChevronRight
            size={15}
          />

          <span className="font-medium text-slate-800">
            Lesson{" "}
            {
              lesson.lesson_order
            }
          </span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
          {/* MAIN CONTENT */}

          <section>
            {/* VIDEO */}

            <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-sm">
              {videoUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={
                      videoUrl
                    }
                    title={
                      lesson.title
                    }
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center px-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                      <PlayCircle
                        size={32}
                      />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                      Lesson video
                      coming soon
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                      Video content
                      has not been
                      added to this
                      lesson yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* LESSON INFORMATION */}

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  Module{" "}
                  {
                    lesson.module
                      .module_order
                  }
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Lesson{" "}
                  {
                    lesson.lesson_order
                  }
                </span>

                {lesson.is_preview && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    Preview
                  </span>
                )}

                {lessonCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2
                      size={14}
                    />

                    Completed
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {lesson.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <BookOpen
                    size={16}
                  />

                  {
                    lesson.module
                      .title
                  }
                </div>

                {lesson.duration_minutes >
                  0 && (
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={16}
                    />

                    {
                      lesson.duration_minutes
                    }{" "}
                    minutes
                  </div>
                )}
              </div>

              {lesson.description && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    About this
                    lesson
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                    {
                      lesson.description
                    }
                  </p>
                </div>
              )}

              {/* COMPLETE BUTTON */}

              <div className="mt-8 border-t border-slate-100 pt-6">
                {lessonCompleted ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={24}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <div>
                        <h3 className="font-bold text-green-900">
                          Lesson
                          completed
                        </h3>

                        <p className="mt-1 text-sm text-green-700">
                          Your
                          progress has
                          been saved.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={
                      markLessonComplete
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {saving ? (
                      "Saving progress..."
                    ) : (
                      <>
                        <CheckCircle2
                          size={
                            18
                          }
                        />

                        Mark as
                        Complete

                        {nextLesson && (
                          <ChevronRight
                            size={
                              18
                            }
                          />
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* PREVIOUS / NEXT */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {previousLesson ? (
                <Link
                  href={`/learn/${courseId}/lesson/${previousLesson.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <ChevronLeft
                      size={15}
                    />

                    Previous Lesson
                  </div>

                  <p className="mt-2 font-semibold text-slate-800 transition group-hover:text-blue-600">
                    {
                      previousLesson.title
                    }
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson &&
              lessonCompleted ? (
                <Link
                  href={`/learn/${courseId}/lesson/${nextLesson.id}`}
                  className="group rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm transition hover:bg-blue-100 sm:text-right"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-600 sm:justify-end">
                    Next Lesson

                    <ChevronRight
                      size={15}
                    />
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {
                      nextLesson.title
                    }
                  </p>
                </Link>
              ) : nextLesson ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5 sm:text-right">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 sm:justify-end">
                    <Lock
                      size={14}
                    />

                    Next Lesson
                  </div>

                  <p className="mt-2 font-semibold text-slate-500">
                    Complete this
                    lesson to unlock
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {/* SIDEBAR */}

          <aside>
            <div className="space-y-5 lg:sticky lg:top-24">
              {/* PROGRESS */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <GraduationCap
                    size={24}
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Your Progress
                </h3>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-3xl font-bold text-slate-900">
                    {progress}%
                  </span>

                  <span className="text-sm font-medium text-slate-500">
                    {
                      completedCount
                    }
                    /
                    {
                      allLessons.length
                    }{" "}
                    lessons
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* MODULE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Current Module
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  Module{" "}
                  {
                    lesson.module
                      .module_order
                  }
                  :{" "}
                  {
                    lesson.module
                      .title
                  }
                </h3>

                {lesson.module
                  .description && (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {
                      lesson.module
                        .description
                    }
                  </p>
                )}

                <Link
                  href={`/learn/${courseId}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  <ArrowLeft
                    size={16}
                  />

                  View full
                  curriculum
                </Link>
              </div>

              {/* COURSE */}

              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  NextPeer Learning
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  {course.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Complete lessons
                  in sequence to
                  unlock the full
                  program.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
