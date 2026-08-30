"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    // MOCKED: real flow calls POST /auth/login { email, password }
    console.log("login_request:", { email, password });
    // NOTE: since backend doesn't exist yet, we can't know the real role/name here -
    // defaulting to student for now until real auth returns actual user data
        login({ name: email.split("@")[0], email, role: "student" });
    router.push("/dashboard/student?welcome=back");
  }

  const canSubmit = email && password;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="rounded-default border border-zinc-200 bg-white p-8 shadow-sm">
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
                  ? "mt-2 rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-orange-700"
                  : "mt-2 rounded-default bg-zinc-300 px-6 py-3 font-medium text-white cursor-not-allowed"
              }
            >
              Log In
            </button>
          </form>
        </div>

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