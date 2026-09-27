import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to NextPeer
          </Link>

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">

            {/* Brand */}
            <div className="mb-8 text-center">
            <img
  src="/logo.png"
  alt="NextPeer Logo"
  className="mx-auto mb-4 h-20 w-20 object-contain"
/>

              <p className="mb-2 text-sm font-bold text-blue-600">
                NEXTPEER
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back 👋
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Log in and continue building skills that actually matter.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Log in to NextPeer →
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="text-lg font-bold text-blue-600">G</span>
              Continue with Google
            </button>

            {/* Signup */}
            <p className="mt-7 text-center text-sm text-slate-500">
              New to NextPeer?{" "}
              <Link
                href="/signup"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Create your account
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Learn today. Build tomorrow.
          </p>
        </div>
      </div>
    </main>
  );
}
