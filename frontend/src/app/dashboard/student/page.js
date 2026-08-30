"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function StudentDashboard() {
  const { user, loading, hasTakenQuiz } = useAuth();
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

  let heading = `Welcome back, ${user.name}`;
  let subtext = "Ready to find a tutor matched to how you learn?";

  if (welcome === "new") {
    heading = `Congratulations, ${user.name}!`;
    subtext = "Your account is ready. We think PeerLinkAI is really going to work for you.";
  } else if (welcome === "back") {
    heading = `Welcome back, ${user.name} — we missed you!`;
    subtext = "Ready to pick up where you left off?";
  } else if (welcome === "quiz-done") {
    heading = `Nice work, ${user.name}!`;
    subtext = "Your learning style is saved. Let's find tutors who match how you learn.";
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-default bg-secondary p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>
          <p className="mt-2 text-zinc-300">{subtext}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Link
            href="/quiz"
            className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md block"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-secondary text-lg">Learning Style Quiz</h2>
              <span
                className={
                  hasTakenQuiz
                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-success"
                    : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-warning"
                }
              >
                {hasTakenQuiz ? "Completed" : "Required"}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              {hasTakenQuiz
                ? "You can retake the quiz anytime if your learning style changes."
                : "Take this quick quiz so we can match you with tutors who teach the way you learn best."}
            </p>
          </Link>

          {hasTakenQuiz ? (
            <Link
              href="/search"
              className="rounded-default border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md block"
            >
              <h2 className="font-semibold text-secondary text-lg">Find a Tutor</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Search by subject and see tutors ranked by how well they match you.
              </p>
            </Link>
          ) : (
            <div className="rounded-default border border-zinc-200 bg-zinc-100 p-6 opacity-60">
              <h2 className="font-semibold text-zinc-500 text-lg">Find a Tutor</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Complete the learning style quiz first to unlock personalized tutor matches.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-default border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold text-secondary text-lg">Your Sessions</h2>
          <p className="mt-2 text-sm text-zinc-600">
            You haven't booked any sessions yet. Once you find a tutor, your upcoming and past sessions will appear here.
          </p>
        </div>
      </div>
    </main>
  );
}