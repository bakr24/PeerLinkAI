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
cd ai-layer && python3 -m pytest test_recommend.py -v
```
5 targeted tests: content-relevance ranking, style-match ranking,
empty-list safety, `top_n` limiting, blank-query safety.
