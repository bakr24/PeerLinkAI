"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // MOCKED: real flow calls POST /auth/login { email, password }
    console.log("login_request:", { email, password });
    alert("Login submitted (backend not connected yet). Check console.");
  }

  const canSubmit = email && password;

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-secondary">Welcome Back</h1>
        <p className="mt-2 text-zinc-600">Log in to your PeerLinkAI account.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
              placeholder="Your password"
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
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}