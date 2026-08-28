"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-secondary">
          PeerLink<span className="text-primary">AI</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/search" className="text-sm font-medium text-zinc-600 hover:text-primary">
            Find a Tutor
          </Link>
          <Link href="/become-tutor" className="text-sm font-medium text-zinc-600 hover:text-primary">
            Become a Tutor
          </Link>
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-primary">
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-default bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}