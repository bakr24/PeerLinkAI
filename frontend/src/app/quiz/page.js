"use client";

import { useState } from "react";
import Button from "@/components/Button";

const questions = [
  { id: "q1", text: "I understand things better when I see a diagram or video rather than reading text.", dimension: "visual" },
  { id: "q2", text: "I prefer working through real examples over learning theory first.", dimension: "practical" },
  { id: "q3", text: "I like to move quickly through material rather than go slow and thorough.", dimension: "pace" },
  { id: "q4", text: "I learn best when I can ask questions and get back-and-forth feedback.", dimension: "interaction" },
  { id: "q5", text: "Charts, images, and visuals help me remember things more than plain text.", dimension: "visual" },
  { id: "q6", text: "I would rather try something hands-on than read about how it works first.", dimension: "practical" },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState({});

  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    const dimensionTotals = { visual: [], practical: [], pace: [], interaction: [] };

    questions.forEach((q) => {
      const rawValue = answers[q.id];
      if (rawValue !== undefined) {
        const normalized = (rawValue - 1) / 4;
        dimensionTotals[q.dimension].push(normalized);
      }
    });

    const learningStyleVector = {};
    Object.keys(dimensionTotals).forEach((dim) => {
      const values = dimensionTotals[dim];
      learningStyleVector[dim] = values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0.5;
    });

    console.log("learning_style_vector:", learningStyleVector);
    alert("Quiz submitted. Check the browser console for your learning style vector (backend not connected yet).");
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-secondary">Learning Style Quiz</h1>
        <p className="mt-2 text-zinc-600">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>

        <div className="mt-10 flex flex-col gap-8">
          {questions.map((q) => (
            <div key={q.id} className="rounded-default border border-zinc-200 p-5">
              <p className="text-secondary font-medium">{q.text}</p>
              <div className="mt-4 flex gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(q.id, value)}
                    className={
                      answers[q.id] === value
                        ? "h-10 w-10 rounded-full bg-primary text-white font-medium"
                        : "h-10 w-10 rounded-full border border-zinc-300 text-zinc-600 hover:border-primary"
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

                <Button onClick={handleSubmit} disabled={!allAnswered} className="mt-10 w-full">
          See My Matches
        </Button>
      </div>
    </main>
  );
}