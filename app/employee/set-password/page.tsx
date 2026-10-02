
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetPasswordPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function checkInvitation() {
      try {
        const params = new URLSearchParams(window.location.search);
        const tokenHash = params.get("token_hash");
        const type = params.get("type");
        const code = params.get("code");

        // Support invitation links using token_hash.
        if (tokenHash && type === "invite") {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "invite",
          });

          if (verifyError) throw verifyError;
        } else if (code) {
          // Support Supabase PKCE invitation redirects.
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) throw exchangeError;
        } else if (window.location.hash.includes("error=")) {
          const hash = new URLSearchParams(
            window.location.hash.substring(1)
          );

          throw new Error(
            hash.get("error_description") ||
              "This invitation link is invalid or expired."
          );
        }

        // The browser Supabase client also supports invitation
        // links that return tokens in the URL fragment.
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && window.location.hash.includes("access_token=")) {
          const hash = new URLSearchParams(
            window.location.hash.substring(1)
          );

          const accessToken = hash.get("access_token");
          const refreshToken = hash.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) throw sessionError;
            session = data.session;
          }
        }

        if (!session) {
          throw new Error(
            "Your invitation could not be verified. Please open the invitation link from your email."
          );
        }

        if (active) setReady(true);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify invitation."
          );
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    void checkInvitation();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess("Password created successfully. Redirecting...");

      router.replace("/employee/calendar");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <p className="font-semibold text-blue-600">NextPeer</p>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Set Your Password
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Welcome to NextPeer. Create a password to access your
          employee account.
        </p>

        {checking && (
          <p className="mt-6 text-sm text-gray-600">
            Verifying your invitation...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {!checking && ready && !success && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Enter your password again"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Creating Account..." : "Set Password"}
            </button>
          </form>
        )}

        {!checking && !ready && (
          <p className="mt-5 text-sm text-gray-600">
            If your invitation has expired, contact HR for a new
            invitation.
          </p>
        )}
      </section>
    </main>
  );
}
