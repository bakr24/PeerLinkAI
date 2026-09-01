# backend — Minimal Demo Bridge

**This is NOT the full backend.** It's a small, deliberately scoped FastAPI
app with exactly one real endpoint (`/search`), built to prove the AI layer
works live for the demo while the full backend (auth, database, remaining
endpoints per `docs/API.md`) is still being built.

## What's here
- `GET /search?q=...` — calls `ai-layer/recommend.py`'s `recommend_tutors()`
  against a small hardcoded tutor list (see `SEED_TUTORS_DATA` in `main.py`)
- `GET /health` — basic liveness check

## What's deliberately NOT here
- No auth, no database, no persistence — tutors are hardcoded in `main.py`
- No `/tutor/apply`, `/tutor/quiz`, `/session/*`, `/match` endpoints — see `docs/API.md` for the full planned contract
- No learning-style quiz wiring — `/search` accepts `visual`/`practical`/`pace`/`interaction` query params defaulting to neutral (0.5); wire these up once the frontend's onboarding quiz is connected

## Running it

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend expects it at `http://localhost:8000` by default (see `NEXT_PUBLIC_BACKEND_URL` in `frontend/src/app/search/page.js`).

## For whoever builds the full backend

Feel free to replace this file entirely — the only thing that needs to keep
working is the `/search` response shape:
```json
[{"id": "...", "name": "...", "subject": "...", "verified": true, "bio": "...", "matchScore": 0.0, "matchReason": "..."}]
```
That's what `frontend/src/app/search/page.js` already expects. Everything
else here (the hardcoded `SEED_TUTORS_DATA`) is a stand-in for real database
data and should be the first thing swapped out.
