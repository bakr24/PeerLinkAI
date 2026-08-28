# AI Edu-Matching Platform — Architecture

## 1. Project Overview

An AI-powered educational platform where:

- Students create a learning profile.
- Tutors apply to teach subjects.
- Tutors pass an AI-generated qualification quiz.
- Students search for subjects.
- AI recommends tutors based on subject relevance and learning-style compatibility.
- Students complete learning sessions.
- AI generates post-session MCQs.
- Quiz results identify weak topics.
- Student learning profiles can be adaptively improved for future recommendations.

## 2. Architecture

The system is divided into three primary application layers:

### Frontend

Technology:
- Next.js
- Tailwind CSS

Responsibilities:
- Authentication UI
- Student onboarding
- Learning-style quiz
- Tutor search
- Tutor cards
- Tutor application
- Qualification quiz
- Session flow
- Post-session quiz
- Results
- Responsive UI

### Backend

Technology:
- FastAPI
- Python

Responsibilities:
- Authentication integration
- API routes
- Business logic
- Database access
- Session management
- Calling the AI layer
- Validation
- API response contracts

### AI Layer

Technology:
- Python

Responsibilities:

`recommend_tutors()`
- Semantic tutor matching
- Learning-style matching
- Ranking
- Match explanation

`generate_quiz()`
- Tutor qualification quizzes
- Post-session quizzes

`grade_quiz()`
- Score calculation
- Pass/fail
- Weak-topic identification

`apply_feedback()`
- Analyze quiz performance
- Adjust learning-style profile
- Store feedback event

## 3. Request Flow

Frontend
    |
    v
FastAPI Backend
    |
    +----> Supabase/Postgres
    |
    +----> AI Layer
              |
              +----> Embeddings
              |
              +----> LLM
              
AI results
    |
    v
Backend
    |
    v
Frontend

The frontend must never call AI functions directly.

## 4. AI Matching

Tutor recommendations use two independent scores:

### Content Score

Semantic similarity between:

- Student search query
- Tutor profile text

Cosine similarity is used.

### Style Score

Similarity between:

- Student learning-style vector
- Tutor teaching-style vector

Euclidean distance is normalized into a 0–1 similarity score.

### Final Score

final_score = (0.6 * content_score) + (0.4 * style_score)

Content relevance has higher priority than learning-style compatibility.

## 5. Adaptive Feedback

After a student completes a post-session quiz:

1. Identify weak topics.
2. Calculate a bounded learning-style adjustment.
3. Update the student's learning profile.
4. Store a feedback event.
5. Use the updated profile for future recommendations.

This is rule-based for the hackathon rather than a trained ML model.

## 6. Ownership

Person A:
- backend/

Person B:
- frontend/
- design/

Person C:
- ai-layer/

Nobody edits another person's primary application folder without explicit team agreement.

## 7. Shared Files

The following are shared contracts:

- docs/API.md
- docs/SCHEMA.md
- docs/ARCHITECTURE.md
- design/DESIGN_SYSTEM.md
- AGENT.md

Changes to shared contracts must be communicated to the team before implementation.

## 8. Hackathon Scope

Prioritize:

1. AI tutor recommendation
2. Learning-style profiling
3. Tutor qualification
4. Post-session AI quiz
5. Quiz grading
6. Adaptive feedback

Explicitly excluded unless time permits:

- Real payments
- Real-time video
- Real-time chat
- Production-scale infrastructure