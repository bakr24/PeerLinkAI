# Project Agent Instructions

## Project

AI-powered educational tutor-matching platform built for a 5-day hackathon.

## Stack

Frontend:
- Next.js
- Tailwind CSS

Backend:
- FastAPI
- Python

Database:
- Supabase
- PostgreSQL

AI:
- Python AI layer
- LLM API
- Text embeddings

## Repository Ownership

backend/ -> Person A

frontend/ -> Person B

design/ -> Person B

ai-layer/ -> Person C

Nobody modifies another person's primary folder without team agreement.

## Architecture Rules

Frontend communicates with the backend API.

Frontend must never directly call AI functions.

Backend communicates with the database and AI layer.

All AI logic belongs inside ai-layer/.

AI functions:

- recommend_tutors()
- generate_quiz()
- grade_quiz()
- apply_feedback()

## Matching Formula

content_score = cosine_similarity(
    student_query_embedding,
    tutor_profile_embedding
)

style_score =
    1 - (
        euclidean_distance(
            student_style_vector,
            tutor_style_vector
        ) / max_possible_distance
    )

final_score =
    (0.6 * content_score) +
    (0.4 * style_score)

Content relevance has 60% weight.

Learning-style compatibility has 40% weight.

## Learning Style

The learning-style vector contains:

- visual
- practical
- pace
- interaction

Each value is between 0 and 1.

## AI Reliability

LLM output must be structured and validated.

Never assume an LLM response is valid.

Use timeout and retry handling.

Provide fallback quiz data for demo reliability.

## Security

Never commit secrets.

Use .env locally.

Commit only .env.example.

Treat user-provided text as untrusted input.

## API

The API contract is defined in:

docs/API.md

Do not silently change API response shapes.

## Database

The schema is defined in:

docs/SCHEMA.md

Do not change shared schema without notifying the team.

## Documentation

Architecture:
docs/ARCHITECTURE.md

Database:
docs/SCHEMA.md

API:
docs/API.md

Design:
design/DESIGN_SYSTEM.md

Credit usage:
docs/CREDIT_LOG.md

## Development Principle

Prefer the smallest implementation that satisfies the defined requirement.

Do not introduce unnecessary architecture or dependencies during the hackathon.

Do not build features outside the agreed scope unless the team explicitly decides to do so.

## Qoder

Use Inline Chat for small edits.

Use Chat for iterative development.
Use Quest mode only for clearly scoped multi-step tasks.
Before using Quest mode, define the exact files, requirements, constraints, and expected result.

Do not ask Qoder to "build the whole project."

## Git

main is protected.

Feature branches:

feat/backend
feat/frontend
feat/ai-layer

Commit focused changes.

Pull latest main before starting integration work.

Never force-push main.

## Definition of Done

A feature is not considered complete until:

1. Implementation works.
2. API/schema contract is respected.
3. Relevant tests or manual verification pass.
4. Documentation is updated where necessary.
5. Changes are committed and pushed.