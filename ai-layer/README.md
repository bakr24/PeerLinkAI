# ai-layer — Tutor Recommendation Module

Owned by: AI-layer track. Backend calls the one function below — nothing
else in this folder is a stable contract.

## Public function

```python
from recommend import recommend_tutors
from models import StudentProfile, TutorProfile, LearningStyleVector

results = recommend_tutors(student, query, tutors, top_n=5)
```

**Input**
- `student: StudentProfile` — `student_id` + `learning_style` (4-dim vector, see below)
- `query: str` — free-text search, e.g. `"calculus, need visual step-by-step help"`. Can be empty.
- `tutors: list[TutorProfile]` — each with `tutor_id`, `name`, `subject`, `bio`, `teaching_style`
- `top_n: int` — how many results to return (default 5)

**Output**: `list[RecommendationResult]`, sorted best-first, each with
`tutor_id`, `name`, `final_score`, `content_score`, `style_score`, `reason`
(a human-readable string for the "why this match" UI label).

**Never raises** on empty tutor lists or blank queries — returns `[]` or
a style-only ranking respectively. Safe to call directly from any request
handler without a try/except for those cases.

## The ranking formula

```
final_score = 0.6 * content_score + 0.4 * style_score
```
- `content_score`: TF-IDF/cosine similarity between `query` and each tutor's `subject + bio + teaching_style_tags`
- `style_score`: `1 - normalized_euclidean_distance` between student and tutor 4-dim learning-style vectors

Weights live at the top of `recommend.py` as `CONTENT_WEIGHT` /
`STYLE_WEIGHT` — tune there, nowhere else.

## Learning-style vector (4 dims, each 0.0–1.0)

| Field | Meaning |
|---|---|
| `visual` | prefers diagrams/video vs. text |
| `practical` | prefers hands-on examples vs. theory |
| `pace` | 0 = slow/thorough, 1 = fast/dense |
| `interaction` | 0 = independent, 1 = wants back-and-forth Q&A |

## Current implementation note (hackathon day)

`embeddings.py` uses TF-IDF + cosine similarity — no API key, no network
call, no per-search cost. If time/credits allow swapping in a real
embedding API (OpenAI `text-embedding-3-small` or similar), only
`embeddings.py`'s `content_similarity()` needs to change — its signature
is the contract, `recommend.py` never needs to change.

## Tests

```
cd ai-layer && python3 -m pytest -v
```
18 tests total: 5 for recommendation ranking, 7 for quiz generation/grading, 6 for adaptive feedback.

---

# ai-layer — Quiz Generation & Grading Module

## Public functions

```python
from quiz import generate_quiz, grade_quiz
from quiz_models import QuizQuestion, QuizResult

questions = generate_quiz(topic="calculus", quiz_type="post_session", num_questions=4)
result = grade_quiz(questions, student_answers=[1, 0, 2, 1])
```

**`generate_quiz(topic, quiz_type="post_session", num_questions=4) -> list[QuizQuestion]`**
Tries a real LLM call first. Set `ANTHROPIC_API_KEY` as an environment variable to enable it. You can also override the model with `ANTHROPIC_MODEL` (defaults to `claude-3-5-sonnet-20241022`). If the key is missing, the call times out, or the response can't be parsed as valid JSON, it **automatically falls back** to a small hand-written question bank (calculus, algebra, physics, plus a generic fallback for any other topic). Never raises, never returns an empty list.

**`grade_quiz(questions, student_answers) -> QuizResult`**
Fully deterministic, no LLM involved. Compares each answer index to `correct_index`, computes score, and flags `weak_topics` from the `topic` field of every question answered wrong. Handles missing/short answer lists gracefully — never raises `IndexError`.

**`QuizResult`**: `score`, `total`, `passed` (60% threshold), `weak_topics: list[str]`

## Demo-safety note

Set `ANTHROPIC_API_KEY` before the demo to get real LLM-generated questions. If it's not set, or the API has any hiccup, the fallback bank kicks in silently — the quiz screen never breaks or shows empty, which matters more on demo day than which generator produced the questions.
