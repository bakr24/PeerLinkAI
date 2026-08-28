"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function TutorDashboard() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">
          Welcome, {user?.name || "Tutor"}
        </h1>
        <p className="mt-2 text-zinc-600">Manage your tutoring profile and applications.</p>

        <div className="mt-8 flex flex-col gap-4">
          <Link href="/become-tutor" className="rounded-default border border-zinc-200 p-5 hover:border-primary transition-colors block">
            <h2 className="font-semibold text-secondary">Apply to Teach a Subject</h2>
            <p className="text-sm text-zinc-600 mt-1">Pass a quick qualification quiz to get listed</p>
          </Link>
        </div>
      </div>
    </main>
  );
}