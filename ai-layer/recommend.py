"""
Tutor recommendation module.

Owned entirely by this file (and embeddings.py, models.py in this folder).
backend/ calls ONLY `recommend_tutors()` below. Nothing else here is a
public contract, and it can be rewritten freely as long as that one
function's signature and return shape stay stable.

Ranking formula (see docs/ARCHITECTURE.md ADR-001 for the reasoning):
    final_score = 0.6 * content_score + 0.4 * style_score

content_score  -> TF-IDF/cosine similarity between student query and tutor bio
style_score    -> 1 - normalized Euclidean distance between student and
                   tutor learning-style vectors
"""
import math

from embeddings import content_similarity
from models import LearningStyleVector, RecommendationResult, StudentProfile, TutorProfile

CONTENT_WEIGHT = 0.6
STYLE_WEIGHT = 0.4

# Max possible Euclidean distance across 4 dims each bounded [0,1] is sqrt(4) = 2.0
_MAX_STYLE_DISTANCE = math.sqrt(4)


def _style_score(student_style: LearningStyleVector, tutor_style: LearningStyleVector) -> float:
    a = student_style.as_tuple()
    b = tutor_style.as_tuple()
    distance = math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))
    score = 1.0 - (distance / _MAX_STYLE_DISTANCE)
    return max(0.0, min(1.0, score))


_STYLE_DIMENSIONS = [
    ("visual", "text-based, conceptual"),
    ("hands-on, practical", "theory-focused"),
    ("fast-paced", "slow-paced, thorough"),
    ("interactive, Q&A-driven", "independent, self-paced"),
]


def _is_default_style(style: LearningStyleVector, tolerance: float = 0.1) -> bool:
    return all(abs(v - 0.5) <= tolerance for v in style.as_tuple())


def _best_aligned_trait(student_style: LearningStyleVector, tutor_style: LearningStyleVector) -> str | None:
    """Return a human-readable trait for the dimension where student and tutor align best."""
    student = student_style.as_tuple()
    tutor = tutor_style.as_tuple()

    best_dim = None
    best_diff = float("inf")
    for i, (high_label, low_label) in enumerate(_STYLE_DIMENSIONS):
        diff = abs(student[i] - tutor[i])
        if diff < best_diff:
            best_diff = diff
            best_dim = high_label if tutor[i] >= 0.5 else low_label

    # Only claim alignment if the styles are actually close and not completely neutral.
    if best_diff > 0.4 or _is_default_style(student_style):
        return None
    return best_dim


def _build_reason(content_score: float, style_score: float, query: str, tutor: TutorProfile,
                   student_style: LearningStyleVector) -> str:
    # Strong content match gets a subject/expertise reason.
    if content_score >= 0.5 or content_score >= style_score:
        if query.strip():
            return f"Strong match for '{query.strip()}' based on {tutor.name}'s expertise in {tutor.subject}"
        return f"Recommended based on {tutor.name}'s expertise in {tutor.subject}"

    # Style-led reason, but only if there is real alignment and the student is not a default vector.
    aligned_trait = _best_aligned_trait(student_style, tutor.teaching_style)
    if aligned_trait:
        return f"Great style fit: {tutor.name} teaches in a {aligned_trait} way that matches your preference"

    # Safe fallback.
    return f"Recommended based on {tutor.name}'s expertise in {tutor.subject}"


def recommend_tutors(
    student: StudentProfile,
    query: str,
    tutors: list[TutorProfile],
    top_n: int = 5,
) -> list[RecommendationResult]:
    """
    Rank `tutors` for `student` given a free-text `query`.

    Never raises on empty input: an empty tutor list returns an empty
    list; an empty/blank query still ranks purely on style fit.
    """
    if not tutors:
        return []

    tutor_texts = [f"{t.subject} {t.bio} {t.teaching_style_tags}" for t in tutors]
    content_scores = content_similarity(query, tutor_texts)

    results: list[RecommendationResult] = []
    for tutor, content_score in zip(tutors, content_scores):
        style_score = _style_score(student.learning_style, tutor.teaching_style)
        final_score = (CONTENT_WEIGHT * content_score) + (STYLE_WEIGHT * style_score)
        reason = _build_reason(content_score, style_score, query, tutor, student.learning_style)
        results.append(
            RecommendationResult(
                tutor_id=tutor.tutor_id,
                name=tutor.name,
                final_score=round(final_score, 4),
                content_score=round(content_score, 4),
                style_score=round(style_score, 4),
                reason=reason,
            )
        )

    results.sort(key=lambda r: r.final_score, reverse=True)
    return results[:top_n]
