"use client";

import { useState, use } from "react";

// MOCKED: real questions come from POST /session/:id/complete -> generate_quiz()
const mockPostSessionQuiz = [
  {
    id: "psq1",
    question: "Placeholder: AI-generated question based on what was covered this session.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 1,
  },
  {
    id: "psq2",
    question: "Placeholder: Another session-topic question would appear here.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
  {
    id: "psq3",
    question: "Placeholder: A third generated question goes here.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 2,
  },
];

export default function SessionPage({ params }) {
  const { id } = use(params);
  const [stage, setStage] = useState("in-progress");
  const [answers, setAnswers] = useState({});

  function handleCompleteSession() {
    // MOCKED: real flow calls POST /session/:id/complete { summary_text } -> triggers generate_quiz()
    console.log("session_complete:", { sessionId: id });
    setStage("quiz");
  }

  function handleAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmitQuiz() {
    // MOCKED: real flow calls POST /session/:id/quiz/submit { answers[] } -> grade_quiz()
    let correctCount = 0;
    mockPostSessionQuiz.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correctCount++;
    });
    const score = Math.round((correctCount / mockPostSessionQuiz.length) * 100);
    console.log("quiz_submission:", { sessionId: id, answers, score });
    setStage("score");
  }

  const allAnswered = mockPostSessionQuiz.every((q) => answers[q.id] !== undefined);
  const correctCount = mockPostSessionQuiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const finalScore = Math.round((correctCount / mockPostSessionQuiz.length) * 100);
  const passed = finalScore >= 60;

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {stage === "in-progress" && (
          <div className="rounded-default border border-zinc-200 p-8 text-center">
            <h1 className="text-2xl font-semibold text-secondary">Session In Progress</h1>
            <p className="mt-2 text-zinc-600">
              Session ID: <span className="font-medium text-secondary">{id}</span>
            </p>
            <p className="mt-4 text-zinc-600">
              Once your session with the tutor is finished, mark it complete to get a quick knowledge check.
            </p>
            <button
              onClick={handleCompleteSession}
              className="mt-6 rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              Mark Session Complete
            </button>
          </div>
        )}

        {stage === "quiz" && (
          <div>
            <h1 className="text-2xl font-semibold text-secondary">Quick Check</h1>
            <p className="mt-2 text-zinc-600 mb-6">Answer a few questions on what you just learned.</p>

            <div className="flex flex-col gap-6">
              {mockPostSessionQuiz.map((q) => (
                <div key={q.id} className="rounded-default border border-zinc-200 p-5">
                  <p className="font-medium text-secondary">{q.question}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt, idx) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, idx)}
                        className={
                          answers[q.id] === idx
                            ? "text-left rounded-default border-2 border-primary bg-green-50 px-4 py-2"
                            : "text-left rounded-default border border-zinc-300 px-4 py-2 hover:border-primary"
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className={
                allAnswered
                  ? "mt-8 w-full rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-green-700"
                  : "mt-8 w-full rounded-default bg-zinc-300 px-6 py-3 font-medium text-white cursor-not-allowed"
              }
            >
              Submit Answers
            </button>
          </div>
        )}

        {stage === "score" && (
          <div className="rounded-default border border-zinc-200 p-8 text-center">
            <h1 className="text-2xl font-semibold text-secondary">
              {passed ? "Nice work!" : "Keep practicing"}
            </h1>
            <p className="mt-4 text-5xl font-bold text-primary">{finalScore}%</p>
            <p className="mt-2 text-zinc-600">
              You got {correctCount} out of {mockPostSessionQuiz.length} correct.
            </p>
            <span
              className={
                passed
                  ? "mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-success"
                  : "mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-warning"
              }
            >
              {passed ? "Pass" : "Needs Review"}
            </span>
          </div>
        )}

      </div>
    </main>
  );
}