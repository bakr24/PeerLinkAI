"use client";

import { Suspense, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TutorDashboard() {
  return (
    <Suspense fallback={null}>
      <TutorDashboardContent />
    </Suspense>
  );
}

function TutorDashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const heading =
    welcome === "new" ? `Congratulations, ${user.name}!` : `Welcome back, ${user.name}`;
  const subtext =
    welcome === "new"
      ? "Your account is ready. Apply to teach a subject to get started as a peer tutor."
      : "Manage your tutoring profile and applications.";

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-default bg-secondary p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Tutor Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>
          <p className="mt-2 text-zinc-300">{subtext}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Link
            href="/become-tutor"
            className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md block"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-secondary text-lg">Apply to Teach a Subject</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
                Not Applied
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Pass a quick qualification quiz on your subject to get listed as a verified tutor.
            </p>
          </Link>

          <div className="rounded-default border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-secondary text-lg">Verification Status</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Apply to a subject first to begin the verification process.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-default border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold text-secondary text-lg">Your Sessions</h2>
          <p className="mt-2 text-sm text-zinc-600">
            No session requests yet. Once you&apos;re verified, students will be able to book you here.
          </p>
        </div>
      </div>
    </main>
  );
}