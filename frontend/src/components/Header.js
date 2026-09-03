"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === "/signup" || pathname === "/login";

  if (isAuthPage) {
    return (
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-secondary">
            PeerLink<span className="text-primary">AI</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-secondary">
          PeerLink<span className="text-primary">AI</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {!user && (
            <>
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="text-sm font-medium text-zinc-600 hover:text-primary"
              >
                Home
              </Link>
              <Link href="/#about" className="text-sm font-medium text-zinc-600 hover:text-primary">
                About
              </Link>
              <Link href="/#why-choose-us" className="text-sm font-medium text-zinc-600 hover:text-primary">
                Why Choose Us
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-primary">
                How It Works
              </Link>
              <Link href="/#contact" className="text-sm font-medium text-zinc-600 hover:text-primary">
                Contact
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href={user.role === "tutor" ? "/dashboard/tutor" : "/dashboard/student"} className="text-sm font-medium text-zinc-600 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/search" className="text-sm font-medium text-zinc-600 hover:text-primary">
                Find a Tutor
              </Link>
              <Link href="/become-tutor" className="text-sm font-medium text-zinc-600 hover:text-primary">
                Become a Tutor
              </Link>
              <Link href="/profile" className="text-sm font-medium text-zinc-600 hover:text-primary">
                Profile
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-zinc-600 hover:text-primary sm:block">
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-default bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="hidden text-sm text-zinc-500 sm:block">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="rounded-default border border-zinc-300 px-4 py-2 text-sm font-medium text-secondary hover:bg-zinc-50"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}