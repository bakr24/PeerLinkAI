export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-4xl font-semibold text-secondary sm:text-5xl">
        Find the Right Tutor, <span className="text-primary">Matched to How You Learn</span>
      </h1>

      <p className="mt-4 max-w-md text-lg text-zinc-600">
        PeerLinkAI matches you with tutors based on your subject needs and your personal learning style, not just a keyword search.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href="/quiz" className="rounded-default bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-green-700">Find My Tutor</a>
        <a href="/become-tutor" className="rounded-default border border-secondary px-6 py-3 font-medium text-secondary transition-colors hover:bg-zinc-50">Become a Tutor</a>
      </div>
    </main>
  );
}