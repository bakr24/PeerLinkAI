"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    // MOCKED: no backend endpoint exists yet for contact submissions
    console.log("contact_request:", { name, email, message });
    setSent(true);
  }

  const canSubmit = name && email && message;

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-semibold text-secondary sm:text-5xl">
          Find the Right Tutor, <span className="text-primary">Matched to How You Learn</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-zinc-600">
          PeerLinkAI matches you with tutors based on your subject needs and your personal learning style, not just a keyword search.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/quiz" variant="primary">Find My Tutor</Button>
          <Button href="/become-tutor" variant="secondary">Become a Tutor</Button>
        </div>
      </section>

      

      {/* About Us */}
      <section id="about" className="scroll-mt-20 bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">About Us</p>
          <h2 className="mt-2 text-3xl font-semibold text-secondary">Built by Students, for Students</h2>
          <p className="mt-4 text-zinc-600">
            PeerLinkAI started with a simple idea: the best person to help you understand a hard
            concept is often another student who just learned it themselves. We built a platform
            where verified students can teach each other, matched not just by subject but by how
            each student actually learns best.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="scroll-mt-20 px-6 py-20"></section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 sm:grid-cols-2">
          <div className="rounded-default bg-secondary p-10 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">PeerLinkAI</p>
            <h2 className="mt-2 text-3xl font-semibold">Peer Tutoring</h2>
            <p className="mt-4 text-zinc-300">
              Serving students with verified peer tutors and personalized matching.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-semibold text-secondary">
              Your Reliable Partner for <span className="text-primary">Better Learning</span>
            </h2>
            <p className="mt-4 text-zinc-600">
              PeerLinkAI is a student-only tutoring platform. Every tutor is a fellow student,
              verified through a subject qualification quiz before getting listed.
            </p>
            <p className="mt-4 text-zinc-600">
              Our focus is simple: verified peer tutors, learning-style matching, and a
              community built exclusively for students.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-20 bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-primary">How It Works</p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-secondary">Three Simple Steps</h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-default bg-white p-6 shadow-sm">
              <span className="text-3xl font-bold text-primary">01</span>
              <h3 className="mt-3 font-semibold text-secondary">Take the Quiz</h3>
              <p className="mt-2 text-sm text-zinc-600">
                A quick learning-style quiz helps us understand how you learn best.
              </p>
            </div>
            <div className="rounded-default bg-white p-6 shadow-sm">
              <span className="text-3xl font-bold text-primary">02</span>
              <h3 className="mt-3 font-semibold text-secondary">Get Matched</h3>
              <p className="mt-2 text-sm text-zinc-600">
                See ranked tutors with a clear reason why each one fits you.
              </p>
            </div>
            <div className="rounded-default bg-white p-6 shadow-sm">
              <span className="text-3xl font-bold text-primary">03</span>
              <h3 className="mt-3 font-semibold text-secondary">Start Learning</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Book a session, then take a quick check to reinforce what you learned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-md">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-primary">Get In Touch</p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-secondary">Contact Us</h2>
          <p className="mt-2 text-center text-zinc-600">Questions or feedback? We'd love to hear from you.</p>

          {sent ? (
            <div className="mt-8 rounded-default border border-zinc-200 p-6 text-center">
              <p className="font-medium text-secondary">Thanks for reaching out!</p>
              <p className="mt-1 text-sm text-zinc-600">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="mt-8 flex flex-col gap-4">
              <div>
                <label className="block font-medium text-secondary mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-default border border-zinc-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="block font-medium text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-default border border-zinc-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="block font-medium text-secondary mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-default border border-zinc-300 px-4 py-3"
                />
              </div>
              <Button type="submit" disabled={!canSubmit} className="mt-2 w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-secondary">Ready to get started?</h2>
        <p className="mt-2 text-zinc-600">Join as a student or start tutoring today.</p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/signup" variant="primary">Sign Up Now</Button>
        </div>
      </section>
    </main>
  );
}