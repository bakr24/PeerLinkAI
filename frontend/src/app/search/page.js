"use client";

import { useState } from "react";
import Link from "next/link";

// MOCKED: real data comes from GET /search?q=<query>&student_id=... -> recommend_tutors()
const mockTutors = [
  {
    id: "t1",
    name: "Sarah Ahmed",
    subject: "Calculus & Algebra",
    verified: true,
    bio: "5 years teaching high school and university-level math with a hands-on, example-first approach.",
    matchScore: 0.91,
    matchReason: "Matches your practical learning style",
  },
  {
    id: "t2",
    name: "Bilal Khan",
    subject: "Calculus, Statistics",
    verified: true,
    bio: "Explains concepts visually using diagrams and step-by-step breakdowns.",
    matchScore: 0.86,
    matchReason: "Strong match for 'calculus' based on tutor expertise",
  },
  {
    id: "t3",
    name: "Ayesha Raza",
    subject: "Algebra, Geometry",
    verified: false,
    bio: "Patient tutor focused on building fundamentals through interactive Q&A.",
    matchScore: 0.78,
    matchReason: "Matches your interaction-based learning style",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    // MOCKED: real flow calls GET /search?q=<query>&student_id=...
    console.log("search_query:", query);
    setHasSearched(true);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">Find a Tutor</h1>
        <p className="mt-2 text-zinc-600">Search by subject or topic to see your best-matched tutors.</p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Calculus, need visual step-by-step help"
            className="flex-1 rounded-default border border-zinc-300 px-4 py-3"
          />
          <button
            type="submit"
            disabled={!query}
            className={
              query
                ? "rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-green-700"
                : "rounded-default bg-zinc-300 px-6 py-3 font-medium text-white cursor-not-allowed"
            }
          >
            Search
          </button>
        </form>

        {hasSearched && (
          <div className="mt-10 flex flex-col gap-4">
            <p className="text-sm text-zinc-500">
              Showing {mockTutors.length} results for "{query}"
            </p>

            {mockTutors.map((tutor) => (
  <Link key={tutor.id} href={`/tutor/${tutor.id}`} className="block rounded-default border border-zinc-200 p-5 hover:border-primary transition-colors">
    
    
    <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-secondary text-lg">{tutor.name}</h2>
                      {tutor.verified && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-success">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{tutor.subject}</p>
                  </div>
                  <span className="text-sm font-medium text-zinc-400">
                    {Math.round(tutor.matchScore * 100)}% match
                  </span>
                </div>

                <p className="mt-3 text-zinc-600">{tutor.bio}</p>

                <div className="mt-4 inline-block rounded-full bg-green-50 px-3 py-1">
                  <span className="text-sm font-medium text-primary">{tutor.matchReason}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}