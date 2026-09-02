"use client";

import { use } from "react";
import Link from "next/link";
import Button from "@/components/Button";

// Mock data array or object (adjust if your file stores this differently)
const mockTutors = {
  1: {
    name: "Alex Rivera",
    subjects: ["React", "JavaScript", "Frontend Development"],
    bio: "Full-stack developer with 4 years of experience building modern React and Vite web apps.",
    matchScore: "94%",
    verified: true,
  },
  2: {
    name: "Sarah Ahmed",
    subjects: ["Calculus", "Algebra"],
    bio: "5 years teaching high school and university-level math with a hands-on approach.",
    matchScore: "91%",
    verified: true,
  },
  3: {
    name: "Bilal Khan",
    subjects: ["Calculus", "Statistics"],
    bio: "Explains concepts visually using diagrams and step-by-step breakdowns.",
    matchScore: "86%",
    verified: true,
  }
};

export default function TutorProfilePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const tutor = mockTutors[id] || mockTutors[1]; // Fallback to 1 if not found

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <Link href="/search" className="text-sm font-medium text-primary hover:underline">
          ← Back to Search Results
        </Link>
      </div>

      <div className="rounded-default border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">{tutor.name}</h1>
          {tutor.verified && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              Verified Tutor
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tutor.subjects.map((sub, idx) => (
            <span key={idx} className="rounded-default bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
              {sub}
            </span>
          ))}
        </div>

        <p className="mt-6 text-zinc-700 leading-relaxed">{tutor.bio}</p>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <Button href="/session/1" className="w-full">
            Book a Session
          </Button>
        </div>
      </div>
    </div>
  );
}