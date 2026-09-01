"""
Adaptive feedback module.

Owned entirely by this file. backend/ calls ONLY `apply_feedback()` below.

Closes the loop between quiz performance (quiz.py's QuizResult) and a
student's learning-style profile (models.py's StudentProfile), so the
platform adapts rather than matching once and forgetting.

Heuristic (deliberately simple and explainable, not a learned model):
struggling on a post-session quiz suggests the student needed a slower
pace and more back-and-forth support than the session gave them, so
those two dimensions get nudged in that direction, proportional to how
much they struggled. A pass leaves the profile untouched — we only
adapt off a signal that something didn't work.
"""
from models import LearningStyleVector, StudentProfile
from quiz_models import QuizResult

DEFAULT_STEP = 0.1  # max nudge per dimension on a total (0-score) failure


def apply_feedback(
    student: StudentProfile,
    quiz_result: QuizResult,
    step: float = DEFAULT_STEP,
) -> StudentProfile:
    """
    Returns a NEW StudentProfile with an adapted learning_style vector.
    Does not mutate `student` — the caller decides whether/how to persist
    the result, so this stays a pure function with no side effects.

    No-op cases (returns the original profile unchanged):
      - quiz was passed (nothing to correct for)
      - quiz_result.total == 0 (no signal to act on)
    """
    if quiz_result.total == 0 or quiz_result.passed:
        return student

    struggle = 1 - (quiz_result.score / quiz_result.total)  # 0.0-1.0
    adjustment = step * struggle

    style = student.learning_style
    adapted_style = LearningStyleVector(
        visual=style.visual,
        practical=style.practical,
        pace=max(0.0, style.pace - adjustment),
        interaction=min(1.0, style.interaction + adjustment),
    )
    return StudentProfile(student_id=student.student_id, learning_style=adapted_style)
