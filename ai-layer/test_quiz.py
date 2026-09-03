import pytest

from quiz import generate_quiz, grade_quiz
from quiz_models import QuizQuestion


def test_quiz_question_rejects_out_of_range_correct_index():
    with pytest.raises(ValueError):
        QuizQuestion(question="Q1", options=["a", "b"], correct_index=5, topic="t1")


def test_generate_quiz_returns_requested_count_without_api_key():
    # No ANTHROPIC_API_KEY set in this test env -> exercises the fallback path
    questions = generate_quiz("calculus", num_questions=4)
    assert len(questions) == 4
    assert all(isinstance(q, QuizQuestion) for q in questions)


def test_generate_quiz_falls_back_for_unknown_topic_without_crashing():
    questions = generate_quiz("underwater basket weaving", num_questions=3)
    assert len(questions) == 3


def test_grade_quiz_all_correct():
    questions = [
        QuizQuestion(question="Q1", options=["a", "b"], correct_index=0, topic="t1"),
        QuizQuestion(question="Q2", options=["a", "b"], correct_index=1, topic="t2"),
    ]
    result = grade_quiz(questions, [0, 1])
    assert result.score == 2
    assert result.total == 2
    assert result.passed is True
    assert result.weak_topics == []


def test_grade_quiz_all_wrong_flags_weak_topics():
    questions = [
        QuizQuestion(question="Q1", options=["a", "b"], correct_index=0, topic="derivatives"),
        QuizQuestion(question="Q2", options=["a", "b"], correct_index=1, topic="integrals"),
    ]
    result = grade_quiz(questions, [1, 0])
    assert result.score == 0
    assert result.passed is False
    assert result.weak_topics == ["derivatives", "integrals"]


def test_grade_quiz_handles_missing_answers_without_crashing():
    questions = [
        QuizQuestion(question="Q1", options=["a", "b"], correct_index=0, topic="t1"),
        QuizQuestion(question="Q2", options=["a", "b"], correct_index=1, topic="t2"),
    ]
    # Student only answered the first question
    result = grade_quiz(questions, [0])
    assert result.score == 1
    assert result.total == 2
    assert "t2" in result.weak_topics


def test_grade_quiz_empty_questions_returns_zero_without_crashing():
    result = grade_quiz([], [])
    assert result.total == 0
    assert result.passed is False
