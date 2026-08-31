# PeerLinkAI

An AI-powered educational matching platform — think Fiverr for tutoring, but where the AI is actually doing work: qualifying tutors, matching students by learning style (not just subject), and quizzing students after every session.

Built by a 3-person team, one shared repository.

---

## What it does

1. **Tutor qualification** — a tutor applies to teach a subject, takes an AI-generated qualifying quiz, and gets a "verified" badge on passing.
2. **Learning-style-aware matching** — a student takes a short onboarding quiz (visual/practical/theoretical, pace, interaction), then searches for a subject. Results are ranked by both subject relevance *and* how well the tutor's teaching style fits the student — not just a keyword match.
3. **Post-session quiz + adaptive feedback** — after a session, the student gets an AI-generated quick quiz on what was covered. Weak topics feed back into the student's learning profile, so the *next* recommendation is measurably better-informed.

## System overview

```
Student                                          Tutor
  │                                                 │
  ├─ Takes learning-style quiz                      ├─ Applies to teach a subject
  ├─ Searches for a subject                         ├─ Takes AI-generated qualifying quiz
  ├─ Sees ranked tutors + "why this match"           └─ Gets verified on passing
  ├─ Books a session with chosen tutor
  ├─ Completes session
  ├─ Takes AI-generated post-session quiz
  └─ Weak topics feed back into future recommendations
```

The AI layer sits behind two calls the rest of the system depends on:
`recommend_tutors()` (ranks tutors by subject relevance + learning-style fit) and
`generate_quiz()` / `grade_quiz()` (post-session assessment, with adaptive feedback
into the student's profile). Everything else — auth, routing, UI — is built around
making those two calls real and visible.

## Why this counts as "AI doing real work"

Every AI feature here produces a visible, explainable output in the demo — not a black box:
- Tutor recommendation shows a plain-English **"why this match"** reason (e.g. *"Matches your hands-on learning style"*)
- Every quiz is generated and graded live, with structured, validated output
- The feedback loop is logged (`feedback_events`) so the reasoning is inspectable, not just claimed

See `ai-layer/README.md` for the exact ranking formula and function contracts.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | FastAPI |
| AI layer | Python (TF-IDF/cosine similarity for matching, LLM calls for quiz generation) |
| Database & Auth | Supabase |

## Project structure

```
PeerLinkAI/
├── frontend/     — Next.js app (search, signup/login, dashboards, quiz UI)
├── backend/      — FastAPI routes, auth, database access
├── ai-layer/     — recommend_tutors(), generate_quiz(), grade_quiz(), apply_feedback()
├── design/       — design tokens and component reference
└── docs/         — architecture, API contract, schema, credit log
```

**Ownership is strictly partitioned per folder** to avoid merge conflicts across the team — each contributor works only inside their own folder, and cross-folder changes go through the shared docs in `docs/` with a heads-up to the team first. See `AGENT.md` and `docs/ARCHITECTURE.md` for the full rationale.

## Getting started

```bash
# Frontend
cd frontend
npm install
npm run dev

# AI layer
cd ai-layer
pip install -r requirements.txt --break-system-packages
python3 -m pytest test_recommend.py -v
```

Backend setup will be added once `feat/backend` lands — see `docs/API.md` for the planned endpoint contract in the meantime.

## Team & workflow

- **3 contributors, 1 shared repo.** Work is split by folder, not by feature, so contributions don't collide:
  - Frontend owner → `frontend/`
  - Backend owner → `backend/`
  - AI-layer owner → `ai-layer/`
- Each person branches from `main` (`feat/frontend`, `feat/backend`, `feat/ai-layer`), opens a PR back into `main` when a piece is ready, and doesn't edit outside their own folder.
- Shared contracts — the API shape, the database schema, and the overall architecture reasoning — live in `docs/`, not scattered across each person's code, so nobody has to guess what another folder expects.

## Docs

- [`AGENT.md`](./AGENT.md) — project context for AI coding assistants
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — ADR and system design
- [`docs/API.md`](./docs/API.md) — endpoint contract
- [`docs/SCHEMA.md`](./docs/SCHEMA.md) — database schema
- [`docs/CREDIT_LOG.md`](./docs/CREDIT_LOG.md) — Qoder credit usage tracking
- [`design/DESIGN_SYSTEM.md`](./design/DESIGN_SYSTEM.md) — tokens and components
- [`ai-layer/README.md`](./ai-layer/README.md) — recommendation module contract
