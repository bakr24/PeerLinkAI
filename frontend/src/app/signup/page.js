"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  function handleSubmit(e) {
    e.preventDefault();
    // MOCKED: real flow calls POST /auth/signup { name, email, password, role }
    console.log("signup_request:", { name, email, password, role });
    alert("Signup submitted (backend not connected yet). Check console.");
  }

  const canSubmit = name && email && password;

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-secondary">Create Your Account</h1>
        <p className="mt-2 text-zinc-600">Join PeerLinkAI as a student or tutor.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={
                role === "student"
                  ? "flex-1 rounded-default bg-primary px-4 py-2 font-medium text-white"
                  : "flex-1 rounded-default border border-zinc-300 px-4 py-2 font-medium text-secondary"
              }
            >
              I'm a Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={
                role === "tutor"
                  ? "flex-1 rounded-default bg-primary px-4 py-2 font-medium text-white"
                  : "flex-1 rounded-default border border-zinc-300 px-4 py-2 font-medium text-secondary"
              }
            >
              I'm a Tutor
            </button>
          </div>

          <div>
            <label className="block font-medium text-secondary mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-default border border-zinc-300 px-4 py-3"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block font-medium text-secondary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-default border border-zinc-300 px-4 py-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-medium text-secondary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-default border border-zinc-300 px-4 py-3"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={
              canSubmit
                ? "mt-2 rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-green-700"
                : "mt-2 rounded-default bg-zinc-300 px-6 py-3 font-medium text-white cursor-not-allowed"
            }
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}