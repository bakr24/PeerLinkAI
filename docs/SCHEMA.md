# Database Schema

## users

- id
- name
- email
- role
- created_at

Roles:
- student
- tutor

## subjects

- id
- name
- category

## learning_profiles

- id
- user_id
- style_vector
- pace_pref
- format_pref

Style vector dimensions:

- visual
- practical
- pace
- interaction

Each dimension ranges from 0 to 1.

## tutor_profiles

- id
- user_id
- subject_id
- bio
- verified
- quiz_score
- teaching_style_tags
- text_vector

The text vector represents the embedded tutor profile.

## quiz_questions

- id
- subject_id
- question_text
- options
- correct_answer
- quiz_type

Quiz types:

- qualifying
- post_session

## quiz_attempts

- id
- user_id
- quiz_id
- score
- passed
- attempted_at

Attempts are historical records and must not be overwritten.

## sessions

- id
- student_id
- tutor_id
- subject_id
- status
- summary_text
- created_at

Possible session states:

- started
- completed

## recommendations

- id
- student_id
- tutor_id
- match_score
- match_reason
- created_at

Stores AI recommendation results for debugging and demonstration.

## feedback_events

- id
- student_id
- session_id
- weak_topics
- style_adjustment
- applied_at

Stores adaptive feedback applied after post-session quizzes.

## Relationships

users
  |
  +---- learning_profiles
  |
  +---- tutor_profiles
  |
  +---- quiz_attempts
  |
  +---- sessions
  |
  +---- recommendations
  |
  +---- feedback_events

subjects
  |
  +---- tutor_profiles
  |
  +---- quiz_questions
  |
  +---- sessions

sessions
  |
  +---- feedback_events