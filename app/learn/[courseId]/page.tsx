"use client";

import { useEffect, useState } from "react";
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

type Course = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
};

type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  enrolled_at: string;
};

const modules = [
  {
    number: 1,
    title: "AI & Data Science Foundations",
    description:
      "Understand artificial intelligence, data science, machine learning and the modern AI ecosystem.",
    lessons: [
      "Introduction to Artificial Intelligence",
      "Understanding Data Science",
      "AI vs Machine Learning vs Deep Learning",
      "Real-world applications of AI",
    ],
  },
  {
    number: 2,
    title: "Python for Data Science",
    description:
      "Build the Python foundations required to work with data and machine learning.",
    lessons: [
      "Python fundamentals",
      "Variables, data types and operators",
      "Conditions, loops and functions",
      "Working with Python data structures",
    ],
  },
  {
    number: 3,
    title: "Data Analysis",
    description:
      "Learn how to clean, analyze and understand real-world datasets.",
    lessons: [
      "Introduction to NumPy",
      "Data analysis with Pandas",
      "Data cleaning and preprocessing",
      "Exploratory Data Analysis",
    ],
  },
  {
    number: 4,
    title: "Data Visualization",
    description:
      "Transform raw information into understandable visual insights.",
    lessons: [
      "Introduction to data visualization",
      "Charts and plots with Matplotlib",
      "Choosing the right visualization",
      "Building data-driven insights",
    ],
  },
  {
    number: 5,
    title: "Machine Learning",
    description:
      "Understand the core concepts behind practical machine learning systems.",
    lessons: [
      "Introduction to Machine Learning",
      "Supervised and unsupervised learning",
      "Regression and classification",
      "Model training and evaluation",
    ],
  },
  {
    number: 6,
    title: "Generative AI",
    description:
      "Explore modern generative AI, large language models and practical AI tools.",
    lessons: [
      "Introduction to Generative AI",
      "Understanding Large Language Models",
      "Prompt engineering fundamentals",
      "Building with AI tools",
    ],
  },
  {
    number: 7,
    title: "Projects & Case Studies",
    description:
      "Apply your knowledge through practical industry-oriented projects.",
    lessons: [
      "Data analysis project",
      "Machine learning project",
      "Generative AI mini project",
      "Final capstone project",
    ],
  },
  {
    number: 8,
    title: "Career & Certification",
    description:
      "Prepare your portfolio and complete the requirements for your NextPeer certificate.",
    lessons: [
      "Building your project portfolio",
      "GitHub project presentation",
      "Resume and LinkedIn preparation",
      "Final assessment and certification",
    ],
  },
];

export default function CourseLearningPage() {
  const router = useRouter();
  const params = useParams();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : (params.courseId as string);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

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
            setLoading(false);
          }

          return;
        }

        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, slug, description")
          .eq("id", courseId)
          .single();

        if (courseError) {
          throw courseError;
        }

        if (mounted) {
          setEnrollment(enrollmentData as Enrollment);
          setCourse(courseData as Course);
        }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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

  if (error || !course || !enrollment) {
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
              {error ||
                "We couldn't verify your enrollment for this program."}
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

  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const completedLessons = 0;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top navigation */}
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
        {/* Course hero */}
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
                  <Clock3 size={17} className="text-blue-300" />
                  3 Months
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <BookOpen size={17} className="text-blue-300" />
                  {modules.length} Modules
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <PlayCircle size={17} className="text-blue-300" />
                  {totalLessons} Lessons
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                  <FolderKanban size={17} className="text-blue-300" />
                  Practical Projects
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress cards */}
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
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
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

                <p className="mt-2 text-xl font-bold text-slate-900">
                  Locked
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Lock size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Complete the program requirements to unlock your certificate.
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_330px]">
          {/* Curriculum */}
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Course Curriculum
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Your learning journey
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Follow the modules in sequence and build your skills step by
                step.
              </p>
            </div>

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => {
                const isFirstModule = moduleIndex === 0;

                return (
                  <div
                    key={module.number}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex gap-4 p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                        {module.number}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {module.title}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {module.description}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {module.lessons.length} Lessons
                          </span>
                        </div>

                        <div className="mt-5 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const lessonAvailable =
                              isFirstModule && lessonIndex === 0;

                            return (
                              <div
                                key={lesson}
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  {lessonAvailable ? (
                                    <PlayCircle
                                      size={19}
                                      className="shrink-0 text-blue-600"
                                    />
                                  ) : (
                                    <Lock
                                      size={17}
                                      className="shrink-0 text-slate-400"
                                    />
                                  )}

                                  <div>
                                    <p className="text-sm font-medium text-slate-700">
                                      {lesson}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                      Lesson {lessonIndex + 1}
                                    </p>
                                  </div>
                                </div>

                                {lessonAvailable && (
                                  <ChevronRight
                                    size={18}
                                    className="shrink-0 text-blue-600"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PlayCircle size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Start learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Begin with the fundamentals and continue through each module
                of your program.
              </p>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start Module 1
                <ChevronRight size={18} />
              </button>

              <div className="my-6 border-t border-slate-100" />

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Program details
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-800">
                    3 Months
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Modules</span>
                  <span className="font-semibold text-slate-800">
                    {modules.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Lessons</span>
                  <span className="font-semibold text-slate-800">
                    {totalLessons}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Enrollment</span>
                  <span className="font-semibold capitalize text-green-600">
                    {enrollment.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <div className="flex gap-3">
                  <GraduationCap
                    size={21}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      NextPeer Certificate
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Complete the required lessons, projects and assessments
                      to become eligible for certification.
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
