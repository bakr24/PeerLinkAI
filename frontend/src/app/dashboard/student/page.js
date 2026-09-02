"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Button from "@/components/Button";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Welcome Banner */}
      <div className="rounded-default bg-secondary p-8 text-white shadow-sm mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Student Dashboard</span>
        <h1 className="text-3xl font-bold mt-1">Welcome back, {user?.name || "Student"}!</h1>
        <p className="text-zinc-300 mt-2">Your account is ready. Explore your learning style matches, find tutors, and manage your sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Learning Style Quiz Card */}
        <div className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-secondary">Learning Style Quiz</h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Completed</span>
            </div>
            <p className="text-sm text-zinc-500 mb-6">You can retake the quiz anytime if your learning style changes.</p>
          </div>
          <Link href="/quiz">
            <Button variant="secondary" className="w-full">Retake Quiz</Button>
          </Link>
        </div>

        {/* Find a Tutor Card */}
        <div className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-secondary mb-2">Find a Tutor</h3>
            <p className="text-sm text-zinc-500 mb-6">Search by subject and see tutors ranked by how well they match your learning style.</p>
          </div>
          <Link href="/search">
            <Button className="w-full">Search Tutors</Button>
          </Link>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-secondary mb-2">Your Sessions</h3>
        <p className="text-sm text-zinc-500">You haven't booked any sessions yet. Once you find a tutor, your upcoming and past sessions will appear here.</p>
      </div>
    </div>
  );
}