from feedback import apply_feedback, DEFAULT_STEP
from models import LearningStyleVector, StudentProfile
from quiz_models import QuizResult


def _student(pace=0.5, interaction=0.5):
    return StudentProfile(
        student_id="s1",
        learning_style=LearningStyleVector(
            visual=0.5, practical=0.5, pace=pace, interaction=interaction
        ),
    )


def test_no_change_when_quiz_passed():
    student = _student()
    result = QuizResult(score=8, total=10, passed=True, weak_topics=[])

    updated = apply_feedback(student, result)

    assert updated.learning_style == student.learning_style


def test_nudges_pace_down_and_interaction_up_on_full_failure():
    student = _student(pace=0.5, interaction=0.5)
    result = QuizResult(score=0, total=4, passed=False, weak_topics=["derivatives"])

    updated = apply_feedback(student, result)

    assert updated.learning_style.pace == 0.5 - DEFAULT_STEP
    assert updated.learning_style.interaction == 0.5 + DEFAULT_STEP


def test_partial_failure_nudges_proportionally_less_than_full_failure():
    student = _student()
    partial = QuizResult(score=2, total=4, passed=False, weak_topics=["limits"])

    updated = apply_feedback(student, partial)

    assert 0.5 - DEFAULT_STEP < updated.learning_style.pace < 0.5


def test_empty_quiz_returns_profile_unchanged_without_crashing():
    student = _student()
    result = QuizResult(score=0, total=0, passed=False, weak_topics=[])

    updated = apply_feedback(student, result)

    assert updated.learning_style == student.learning_style


def test_does_not_mutate_original_profile():
    student = _student(pace=0.5, interaction=0.5)
    result = QuizResult(score=0, total=4, passed=False, weak_topics=["units"])

    apply_feedback(student, result)

    assert student.learning_style.pace == 0.5
    assert student.learning_style.interaction == 0.5


def test_nudge_never_exceeds_bounds_with_large_step():
    student = _student(pace=0.05, interaction=0.98)
    result = QuizResult(score=0, total=4, passed=False, weak_topics=["x"])

    updated = apply_feedback(student, result, step=1.0)

    assert updated.learning_style.pace == 0.0
    assert updated.learning_style.interaction == 1.0
