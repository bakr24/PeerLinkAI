"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">
          Welcome, {user?.name || "Student"}
        </h1>
        <p className="mt-2 text-zinc-600">Ready to find a tutor matched to how you learn?</p>

        <div className="mt-8 flex flex-col gap-4">
          <Link href="/quiz" className="rounded-default border border-zinc-200 p-5 hover:border-primary transition-colors block">
            <h2 className="font-semibold text-secondary">Take the Learning Style Quiz</h2>
            <p className="text-sm text-zinc-600 mt-1">Help us match you with the right tutors</p>
          </Link>
          <Link href="/search" className="rounded-default border border-zinc-200 p-5 hover:border-primary transition-colors block">
            <h2 className="font-semibold text-secondary">Find a Tutor</h2>
            <p className="text-sm text-zinc-600 mt-1">Search by subject and see your best matches</p>
          </Link>
        </div>
      </div>
    </main>
  );
}