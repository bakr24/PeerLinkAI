from models import LearningStyleVector, StudentProfile, TutorProfile
from recommend import recommend_tutors


def _student(**style_kwargs) -> StudentProfile:
    return StudentProfile(student_id="s1", learning_style=LearningStyleVector(**style_kwargs))


def _tutor(tutor_id, subject, bio, **style_kwargs) -> TutorProfile:
    return TutorProfile(
        tutor_id=tutor_id,
        name=f"Tutor {tutor_id}",
        subject=subject,
        bio=bio,
        teaching_style=LearningStyleVector(**style_kwargs),
    )


def test_content_relevant_tutor_ranks_above_irrelevant_one():
    student = _student()  # neutral style, so content should decide the winner
    tutors = [
        _tutor("t1", "Calculus", "I teach step-by-step calculus with worked examples"),
        _tutor("t2", "Pottery", "I teach hand-building pottery techniques"),
    ]
    results = recommend_tutors(student, "calculus help", tutors, top_n=2)
    assert results[0].tutor_id == "t1"
    assert results[0].final_score > results[1].final_score


def test_style_match_wins_when_content_is_tied():
    # Same subject text for both tutors -> content_score roughly equal,
    # so a strong style match should decide the winner.
    student = _student(visual=1.0, practical=0.0, pace=0.0, interaction=0.0)
    tutors = [
        _tutor("visual_match", "Algebra", "Algebra tutoring for students",
               visual=1.0, practical=0.0, pace=0.0, interaction=0.0),
        _tutor("style_mismatch", "Algebra", "Algebra tutoring for students",
               visual=0.0, practical=1.0, pace=1.0, interaction=1.0),
    ]
    results = recommend_tutors(student, "algebra", tutors, top_n=2)
    winner = {r.tutor_id: r for r in results}
    assert winner["visual_match"].final_score > winner["style_mismatch"].final_score


def test_empty_tutor_list_returns_empty_list_not_error():
    student = _student()
    assert recommend_tutors(student, "anything", [], top_n=5) == []


def test_top_n_limits_result_count():
    student = _student()
    tutors = [_tutor(f"t{i}", "Math", "Math tutor") for i in range(10)]
    results = recommend_tutors(student, "math", tutors, top_n=3)
    assert len(results) == 3


def test_blank_query_still_ranks_on_style_without_crashing():
    student = _student(practical=1.0)
    tutors = [
        _tutor("hands_on", "Physics", "hands-on labs", practical=1.0),
        _tutor("theory", "Physics", "theory-heavy lectures", practical=0.0),
    ]
    results = recommend_tutors(student, "", tutors, top_n=2)
    assert len(results) == 2
    assert results[0].tutor_id == "hands_on"
