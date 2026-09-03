# Tutor Quiz Frontend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing tutor-application page to the tutor verification quiz endpoints and display the grading result.

**Architecture:** Keep all client state in `BecomeTutorPage`. Reuse the configured public backend URL, request generated questions from the existing FastAPI endpoint, submit zero-based selected-option indexes in question order, and render the backend result without changing its API contract.

**Tech Stack:** Next.js App Router, React state, browser Fetch API, Tailwind CSS, FastAPI.

---

## File Structure

- Modify: `frontend/src/app/become-tutor/page.js` — owns the application form, quiz request, option selection, submission request, loading/error states, and verification result.
- No files are created for application code. The frontend has no configured unit-test runner, so validation uses lint/build plus an end-to-end browser check against the existing FastAPI backend.

### Task 1: Wire the Tutor Application Page

**Files:**
- Modify: `frontend/src/app/become-tutor/page.js:1-134`
- Verify: `backend/main.py:128-172`

- [ ] **Step 1: Establish the expected backend responses before changing the page**

The application endpoint accepts a subject and bio and returns a `quiz_id` plus questions with `id`, `question`, and `options`. The submission endpoint accepts an ordered list of zero-based option indexes and returns `score`, `total`, `passed`, `verified`, and `weak_topics`.

```json
{
  "quiz_id": "<uuid>",
  "subject": "Mathematics",
  "questions": [
    {
      "id": "<uuid>-q0",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}
```

- [ ] **Step 2: Replace `frontend/src/app/become-tutor/page.js` with the API-backed component**

```jsx
"use client";

import { useState } from "react";
import Button from "@/components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const subjects = ["Mathematics", "Physics", "Computer Science", "English", "Chemistry"];

export default function BecomeTutorPage() {
  const [step, setStep] = useState("select-subject");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/tutor/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, bio }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setQuizId(data.quiz_id);
      setQuestions(data.questions);
      setAnswers({});
      setStep("quiz");
    } catch {
      setError("Couldn't generate the qualification quiz. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(questionId, optionIndex) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionIndex,
    }));
  }

  async function handleSubmitQuiz() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/tutor/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questions.map((question) => answers[question.id]),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setResult(await response.json());
      setStep("submitted");
    } catch {
      setError("Couldn't submit the qualification quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const allAnswered =
    questions.length > 0 &&
    questions.every((question) => answers[question.id] !== undefined);

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">Become a Tutor</h1>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {step === "select-subject" && (
          <div className="mt-10 flex flex-col gap-6">
            <div>
              <label className="mb-2 block font-medium text-secondary">Subject you want to teach</label>
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-default border border-zinc-300 px-4 py-3"
              >
                <option value="">Select a subject</option>
                {subjects.map((availableSubject) => (
                  <option key={availableSubject} value={availableSubject}>
                    {availableSubject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-secondary">Short bio</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                placeholder="Tell students about your teaching experience and style..."
                className="w-full rounded-default border border-zinc-300 px-4 py-3"
              />
            </div>

            <Button onClick={handleApply} disabled={!subject || !bio || loading}>
              {loading ? "Generating Quiz..." : "Continue to Qualification Quiz"}
            </Button>
          </div>
        )}

        {step === "quiz" && (
          <div className="mt-10">
            <p className="mb-6 text-zinc-600">
              Answer these questions to verify your competency in{" "}
              <span className="font-medium text-secondary">{subject}</span>.
            </p>

            <div className="flex flex-col gap-6">
              {questions.map((question) => (
                <div key={question.id} className="rounded-default border border-zinc-200 p-5">
                  <p className="font-medium text-secondary">{question.question}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.id, optionIndex)}
                        className={
                          answers[question.id] === optionIndex
                            ? "rounded-default border-2 border-primary bg-green-50 px-4 py-2 text-left"
                            : "rounded-default border border-zinc-300 px-4 py-2 text-left hover:border-primary"
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSubmitQuiz} disabled={!allAnswered || loading} className="mt-8 w-full">
              {loading ? "Submitting Quiz..." : "Submit Quiz"}
            </Button>
          </div>
        )}

        {step === "submitted" && result && (
          <div className="mt-10 rounded-default border border-zinc-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-secondary">
              {result.verified ? "Tutor Verified" : "Verification Not Passed"}
            </h2>
            <p className="mt-2 text-zinc-600">
              Score: {result.score} out of {result.total}. {result.passed ? "Passed." : "Not passed."}
            </p>
            <p className="mt-2 text-zinc-600">
              {result.verified
                ? "You are now verified to teach this subject."
                : "Review the topics below and submit a new application when ready."}
            </p>
            {result.weak_topics.length > 0 && (
              <p className="mt-2 text-sm text-zinc-500">
                Focus areas: {result.weak_topics.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run static checks**

Run:

```bash
cd "C:/Users/HPs/Desktop/PeerLinkAI/frontend"
npm run lint
npm run build
```

Expected: both commands exit with code `0`.

- [ ] **Step 4: Run the backend and frontend locally**

In one terminal:

```bash
cd "C:/Users/HPs/Desktop/PeerLinkAI/backend"
../.venv/Scripts/python.exe -m uvicorn main:app --reload --port 8000
```

In a second terminal:

```bash
cd "C:/Users/HPs/Desktop/PeerLinkAI/frontend"
npm run dev
```

Expected: FastAPI serves `http://localhost:8000` and Next.js serves the local application URL.

- [ ] **Step 5: Verify the user flow in a browser**

1. Open the local application and navigate to `/become-tutor`.
2. Choose a subject and enter a bio.
3. Click **Continue to Qualification Quiz** and confirm that three non-placeholder questions appear.
4. Select one option on each question and confirm **Submit Quiz** becomes available.
5. Submit the quiz and confirm the result displays score, pass/fail state, verification state, and focus areas when returned.
6. Stop the backend, reload the page, submit the application form, and confirm the connection error is shown without advancing to the quiz.

- [ ] **Step 6: Review and commit the focused change when authorized**

Run:

```bash
cd "C:/Users/HPs/Desktop/PeerLinkAI"
git diff -- frontend/src/app/become-tutor/page.js
git status
```

When the user authorizes a commit:

```bash
git add frontend/src/app/become-tutor/page.js
git commit -m "feat(frontend): connect tutor verification quiz"
git push origin ai-layer-fixes
```

## Self-Review

- Spec coverage: the plan reuses `NEXT_PUBLIC_API_URL`, calls both required endpoints, replaces mock questions, submits ordered option indices, displays all result fields, handles loading/errors, and defines lint/build plus browser verification.
- Placeholder scan: no unresolved requirements or implementation placeholders remain.
- Type consistency: frontend names match the backend contract exactly: `quiz_id`, `questions`, `answers`, `score`, `total`, `passed`, `verified`, and `weak_topics`.
