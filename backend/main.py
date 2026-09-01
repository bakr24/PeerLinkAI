"""
Minimal backend bridge — proves the AI layer works live, end to end.

SCOPE: this is deliberately small. It implements ONE real endpoint
(/search) that calls ai-layer/recommend.py's recommend_tutors() against
a small seeded tutor list. It does NOT implement auth, a database, or
the other endpoints in docs/API.md — those are P3's full backend build.

This exists to unblock the demo: without it, the frontend has no real
AI call to show, only a hardcoded mock array. This file is intentionally
easy to delete/replace once the real backend (with a database, auth,
etc.) is ready — the only contract that matters is the /search response
shape, which already matches what frontend/src/app/search/page.js expects.

Run locally:
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""
import sys
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# ai-layer/ is a sibling folder with a hyphenated name, so it can't be
# imported as a normal Python package — add it to sys.path directly.
AI_LAYER_PATH = Path(__file__).resolve().parent.parent / "ai-layer"
sys.path.insert(0, str(AI_LAYER_PATH))

from recommend import recommend_tutors  # noqa: E402
from models import LearningStyleVector, StudentProfile, TutorProfile  # noqa: E402

app = FastAPI(title="PeerLinkAI — minimal demo backend")

# Demo-only: wide open so the frontend (any localhost port) can call this
# without CORS friction. Tighten this before any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Seeded tutor data (stand-in for a real database) ---
SEED_TUTORS_DATA = [
    {
        "tutor_id": "t1", "name": "Sarah Ahmed", "subject": "Calculus & Algebra",
        "bio": "5 years teaching high school and university-level math with a hands-on, example-first approach.",
        "verified": True, "teaching_style_tags": "hands-on practical example-first",
        "teaching_style": {"visual": 0.3, "practical": 0.9, "pace": 0.5, "interaction": 0.4},
    },
    {
        "tutor_id": "t2", "name": "Bilal Khan", "subject": "Calculus, Statistics",
        "bio": "Explains concepts visually using diagrams and step-by-step breakdowns.",
        "verified": True, "teaching_style_tags": "visual step-by-step diagrams",
        "teaching_style": {"visual": 0.9, "practical": 0.4, "pace": 0.4, "interaction": 0.3},
    },
    {
        "tutor_id": "t3", "name": "Ayesha Raza", "subject": "Algebra, Geometry",
        "bio": "Patient tutor focused on building fundamentals through interactive Q&A.",
        "verified": False, "teaching_style_tags": "interactive patient Q&A fundamentals",
        "teaching_style": {"visual": 0.4, "practical": 0.5, "pace": 0.3, "interaction": 0.9},
    },
    {
        "tutor_id": "t4", "name": "Hamza Iqbal", "subject": "Physics",
        "bio": "Focuses on real-world physics demos and lab-style problem solving.",
        "verified": True, "teaching_style_tags": "hands-on lab demos real-world",
        "teaching_style": {"visual": 0.5, "practical": 0.95, "pace": 0.6, "interaction": 0.4},
    },
    {
        "tutor_id": "t5", "name": "Zara Malik", "subject": "Algebra, Pre-Calculus",
        "bio": "Fast-paced sessions for students who want to move quickly through material.",
        "verified": True, "teaching_style_tags": "fast-paced efficient dense",
        "teaching_style": {"visual": 0.4, "practical": 0.5, "pace": 0.9, "interaction": 0.3},
    },
]


def _to_tutor_profile(d: dict) -> TutorProfile:
    return TutorProfile(
        tutor_id=d["tutor_id"], name=d["name"], subject=d["subject"], bio=d["bio"],
        teaching_style_tags=d["teaching_style_tags"],
        teaching_style=LearningStyleVector(**d["teaching_style"]),
    )


SEED_TUTORS = [_to_tutor_profile(d) for d in SEED_TUTORS_DATA]
SEED_BY_ID = {d["tutor_id"]: d for d in SEED_TUTORS_DATA}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/search")
def search(
    q: str = "",
    visual: float = Query(0.5, ge=0.0, le=1.0),
    practical: float = Query(0.5, ge=0.0, le=1.0),
    pace: float = Query(0.5, ge=0.0, le=1.0),
    interaction: float = Query(0.5, ge=0.0, le=1.0),
    top_n: int = Query(5, ge=1, le=20),
):
    """
    Real, live call into ai-layer/recommend.py. `visual`/`practical`/`pace`/
    `interaction` default to neutral (0.5) until the frontend's learning-style
    quiz is wired up to pass a real student profile — the ranking still works
    meaningfully on content match alone even with a neutral style vector.
    """
    student = StudentProfile(
        student_id="demo-student",
        learning_style=LearningStyleVector(
            visual=visual, practical=practical, pace=pace, interaction=interaction
        ),
    )
    results = recommend_tutors(student, q, SEED_TUTORS, top_n=top_n)

    return [
        {
            "id": r.tutor_id,
            "name": r.name,
            "subject": SEED_BY_ID[r.tutor_id]["subject"],
            "verified": SEED_BY_ID[r.tutor_id]["verified"],
            "bio": SEED_BY_ID[r.tutor_id]["bio"],
            "matchScore": r.final_score,
            "matchReason": r.reason,
        }
        for r in results
    ]
