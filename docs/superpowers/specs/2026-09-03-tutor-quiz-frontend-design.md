# Tutor Quiz Frontend Integration

## Scope

Wire `frontend/src/app/become-tutor/page.js` to the existing FastAPI tutor verification endpoints. Preserve the current page layout and subject/bio inputs.

## Configuration

Use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`. The existing `frontend/.env.local` configures this value for local development.

## Data Flow

1. The user selects a subject and supplies a bio.
2. The page posts `{ subject, bio }` to `POST /tutor/apply`.
3. The response provides a `quiz_id`, subject, and questions. The page stores those values and renders the returned questions.
4. The user selects an option for each question. The page stores each selected option's zero-based index.
5. The page posts the ordered indices to `POST /tutor/quiz/{quiz_id}/submit`.
6. The page presents the score, total, pass/verification outcome, and weak topics.

## State and Errors

The page adds state for returned questions, quiz ID, request loading, errors, and the submitted result. While a request is pending, the relevant button is disabled and displays a loading label. A failed request leaves the user on the current step and shows an actionable error.

The backend remains responsible for LLM fallback: when no Anthropic key is available, it supplies its built-in quiz questions. The frontend does not need a separate fallback.

## Verification

Run the FastAPI backend on port 8000 and the Next.js app locally. Complete an application, select answers, submit the quiz, and confirm that the displayed result matches the backend response. Run the frontend lint/build checks after the integration.
