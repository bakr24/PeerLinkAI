"use client";

import { useState } from "react";
import Button from "@/components/Button";

const subjects = ["Mathematics", "Physics", "Computer Science", "English", "Chemistry"];

// MOCKED: these will come from POST /tutor/apply -> generate_quiz() once ai-layer is ready
const mockQuizQuestions = [
  {
    id: "mq1",
    question: "Placeholder: This question will be AI-generated based on the chosen subject.",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  {
    id: "mq2",
    question: "Placeholder: Another subject-specific competency question goes here.",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  {
    id: "mq3",
    question: "Placeholder: A third generated question would appear here.",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
];

export default function BecomeTutorPage() {
  const [step, setStep] = useState("select-subject");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");
  const [answers, setAnswers] = useState({});

  function handleApply() {
    // MOCKED: real flow calls POST /tutor/apply { subject_id } -> triggers generate_quiz()
    console.log("tutor_apply_request:", { subject, bio });
    setStep("quiz");
  }

  function handleAnswer(questionId, option) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function handleSubmitQuiz() {
    // MOCKED: real flow calls POST /tutor/quiz/:id/submit { answers[] } -> grade_quiz()
    console.log("tutor_quiz_submission:", answers);
    setStep("submitted");
  }

  const allAnswered = mockQuizQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">Become a Tutor</h1>

        {step === "select-subject" && (
          <div className="mt-10 flex flex-col gap-6">
            <div>
              <label className="block font-medium text-secondary mb-2">Subject you want to teach</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-default border border-zinc-300 px-4 py-3"
              >
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-secondary mb-2">Short bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell students about your teaching experience and style..."
                className="w-full rounded-default border border-zinc-300 px-4 py-3"
              />
            </div>
                      <Button onClick={handleApply} disabled={!subject || !bio}>
              Continue to Qualification Quiz
            </Button>
          </div>
        )}

        {step === "quiz" && (
          <div className="mt-10">
            <p className="text-zinc-600 mb-6">
              Answer these questions to verify your competency in <span className="font-medium text-secondary">{subject}</span>.
            </p>

            <div className="flex flex-col gap-6">
              {mockQuizQuestions.map((q) => (
                <div key={q.id} className="rounded-default border border-zinc-200 p-5">
                  <p className="font-medium text-secondary">{q.question}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, opt)}
                        className={
                          answers[q.id] === opt
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

                        <Button onClick={handleSubmitQuiz} disabled={!allAnswered} className="mt-8 w-full">
              Submit Quiz
            </Button>
          </div>
        )}

        {step === "submitted" && (
          <div className="mt-10 rounded-default border border-zinc-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-secondary">Application Submitted</h2>
            <p className="mt-2 text-zinc-600">
              Your answers have been recorded. (Real grading and verified badge come once ai-layer is connected.)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}