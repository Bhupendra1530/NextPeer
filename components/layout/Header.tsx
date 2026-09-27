"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/data/content";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setAuthLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setIsMenuOpen(false);

    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="NextPeer Logo"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />

          <div className="leading-tight">
            <p className="text-lg font-bold text-slate-900">
              Next<span className="text-blue-600">Peer</span>
            </p>

            <p className="hidden text-[11px] text-slate-500 sm:block">
              Learn. Connect. Grow.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive(link.href)
                  ? "text-blue-600 underline decoration-2 underline-offset-8"
                  : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {!authLoading &&
            (user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="p-2 text-slate-700 lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {!authLoading &&
                (user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                    >
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
