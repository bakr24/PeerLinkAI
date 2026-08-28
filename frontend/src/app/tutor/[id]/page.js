// MOCKED: real data comes from GET /tutor/:id -> tutor_profiles table
const mockTutors = {
  t1: {
    id: "t1",
    name: "Sarah Ahmed",
    subject: "Calculus & Algebra",
    verified: true,
    bio: "5 years teaching high school and university-level math with a hands-on, example-first approach. I focus on building intuition through real examples before introducing formal notation.",
    teachingStyleTags: ["Practical", "Patient", "Example-driven"],
    quizScore: 92,
  },
  t2: {
    id: "t2",
    name: "Bilal Khan",
    subject: "Calculus, Statistics",
    verified: true,
    bio: "Explains concepts visually using diagrams and step-by-step breakdowns. Great for students who get lost in dense textbook explanations.",
    teachingStyleTags: ["Visual", "Structured", "Step-by-step"],
    quizScore: 88,
  },
  t3: {
    id: "t3",
    name: "Ayesha Raza",
    subject: "Algebra, Geometry",
    verified: false,
    bio: "Patient tutor focused on building fundamentals through interactive Q&A.",
    teachingStyleTags: ["Interactive", "Fundamentals-first"],
    quizScore: null,
  },
};

export default async function TutorProfilePage({ params }) {
  const { id } = await params;
  const tutor = mockTutors[id];

  if (!tutor) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-secondary">Tutor Not Found</h1>
          <p className="mt-2 text-zinc-600">This tutor profile does not exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-default border border-zinc-200 p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-secondary">{tutor.name}</h1>
            {tutor.verified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-success">
                Verified
              </span>
            )}
          </div>
          <p className="text-zinc-500 mt-1">{tutor.subject}</p>

          <p className="mt-4 text-zinc-600">{tutor.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tutor.teachingStyleTags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-secondary">
                {tag}
              </span>
            ))}
          </div>

          {tutor.quizScore !== null && (
            <p className="mt-4 text-sm text-zinc-500">
              Qualification quiz score: <span className="font-medium text-secondary">{tutor.quizScore}%</span>
            </p>
          )}

          <button className="mt-6 w-full rounded-default bg-primary px-6 py-3 font-medium text-white hover:bg-green-700">
            Book a Session
          </button>
        </div>
      </div>
    </main>
  );
}