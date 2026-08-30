"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function isValidStudentEmail(emailValue) {
    return emailValue.toLowerCase().includes(".edu");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidStudentEmail(email)) {
      setError("Please use your university/school email (must contain .edu, e.g. yourname@university.edu.pk).");
      return;
    }

    // MOCKED: real flow calls POST /auth/signup { name, email, password, role }
    console.log("signup_request:", { name, email, password, role });
        login({ name, email, role });
    if (role === "tutor") {
      router.push("/dashboard/tutor?welcome=new");
    } else {
      router.push("/quiz?new=true");
    }
  }

  const canSubmit = name && email && password;

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
          <h1 className="text-3xl font-semibold text-secondary">Create Your Account</h1>
          
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
                I want to Learn
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
                I want to Teach
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
              <label className="block font-medium text-secondary mb-2">University/School Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-default border border-zinc-300 px-4 py-3"
                placeholder="yourname@university.edu.pk"
              />
              <p className="mt-1 text-xs text-zinc-500">Must be a valid student email (contains .edu)</p>
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

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={
                canSubmit
                  ? "mt-2 rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-orange-700"
                  : "mt-2 rounded-default bg-zinc-300 px-6 py-3 font-medium text-white cursor-not-allowed"
              }
            >
              Create Account
            </button>
          </form>
        </div>

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