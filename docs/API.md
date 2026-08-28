# API Contract

Base URL:

/api

## Authentication

POST /auth/signup

Request:

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student | tutor"
}

POST /auth/login

Request:

{
  "email": "string",
  "password": "string"
}

## Student

POST /student/learning-profile

Request:

{
  "quiz_answers": []
}

Response:

{
  "style_vector": {
    "visual": 0.0,
    "practical": 0.0,
    "pace": 0.0,
    "interaction": 0.0
  }
}

## Subjects

GET /subjects

Returns available subjects.

## Tutor

POST /tutor/apply

Request:

{
  "subject_id": "string"
}

GET /tutor/quiz/{quiz_id}

Returns qualification quiz.

POST /tutor/quiz/{quiz_id}/submit

Request:

{
  "answers": []
}

Response:

{
  "score": 0,
  "passed": false
}

## Search

GET /search?q={query}&student_id={student_id}

Returns ranked tutors.

Each recommendation should contain:

{
  "tutor": {},
  "match_score": 0.0,
  "match_reason": "string"
}

## Matching

POST /match

Request:

{
  "student_id": "string",
  "tutor_id": "string"
}

## Sessions

POST /session/start

Request:

{
  "student_id": "string",
  "tutor_id": "string",
  "subject_id": "string"
}

POST /session/{session_id}/complete

Request:

{
  "summary_text": "string"
}

Completing a session triggers post-session quiz generation.

GET /session/{session_id}/quiz

Returns generated MCQs.

POST /session/{session_id}/quiz/submit

Request:

{
  "answers": []
}

Response:

{
  "score": 0,
  "weak_topics": []
}

This endpoint also triggers the adaptive feedback process.

## AI Layer Contract

recommend_tutors(
    student_profile,
    query,
    tutor_list,
    top_n=5
)

Returns:

[
    {
        "tutor": {},
        "score": 0.0,
        "reason": "string"
    }
]

generate_quiz(
    subject_or_session_summary,
    quiz_type
)

Returns validated MCQs.

grade_quiz(
    answers,
    correct_answers
)

Returns:

{
    "score": 0,
    "passed": false,
    "weak_topics": []
}

apply_feedback(
    student_id,
    quiz_result
)

Updates the learning profile and records a feedback event.