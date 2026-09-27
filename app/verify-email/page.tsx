import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to NextPeer
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/60 sm:p-9">
            <img
              src="/logo.png"
              alt="NextPeer Logo"
              className="mx-auto mb-4 h-20 w-20 object-contain"
            />

            <p className="mb-5 text-sm font-bold text-blue-600">
              NEXTPEER
            </p>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MailCheck size={30} />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Check your inbox 📩
            </h1>

            <p className="mt-4 leading-7 text-slate-500">
              We've sent you a verification link. Verify your email to
              activate your NextPeer account and continue your learning
              journey.
            </p>

            <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Didn't see the email? Check your spam or promotions folder
              before trying again.
            </div>

            <Link
              href="/login"
              className="mt-7 block w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Go to Login →
            </Link>

            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              Return to homepage
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Learn today. Build tomorrow.
          </p>
        </div>
      </div>
    </main>
  );
}
