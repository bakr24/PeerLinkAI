"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: query });

      // If the student has taken the learning-style quiz, send their real
      // vector so /search returns personalized results. Falls back to the
      // backend's neutral defaults (0.5 each) if none is stored yet.
      const storedStyle = localStorage.getItem("peerlinkai_learning_style");
      if (storedStyle) {
        const style = JSON.parse(storedStyle);
        ["visual", "practical", "pace", "interaction"].forEach((dim) => {
          if (typeof style[dim] === "number") {
            params.set(dim, style[dim]);
          }
        });
      }

      const res = await fetch(`${API_URL}/search?${params.toString()}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setTutors(data);
      setHasSearched(true);
    } catch (err) {
      setError("Couldn't reach the matching service. Is the backend running?");
      setTutors([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
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
                    <Button type="submit" disabled={!query || loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {hasSearched && (
          <div className="mt-10 flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <p className="text-sm text-zinc-500">
                Showing {tutors.length} results for "{query}"
              </p>
            )}

            {tutors.map((tutor) => (
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