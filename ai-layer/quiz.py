"""
Quiz generation + grading module.

Owned entirely by this file (plus quiz_models.py, llm_client.py in this
folder). backend/ calls ONLY `generate_quiz()` and `grade_quiz()` below.

generate_quiz() tries a real LLM call first (if ANTHROPIC_API_KEY is set),
and falls back to a small hand-written question bank if the key is
missing or the call fails for any reason. This means the demo NEVER
crashes or shows an empty quiz screen, with or without a working API key.

grade_quiz() is fully deterministic — no LLM involved, no failure mode
beyond bad input, which we guard against explicitly.
"""
import json
import re

from llm_client import call_llm
from quiz_models import QuizQuestion, QuizResult

PASS_THRESHOLD = 0.6  # 60% correct to pass

# --- Fallback question bank (used when no LLM key / LLM call fails) ---
_FALLBACK_BANK: dict[str, list[dict]] = {
    "calculus": [
        {"question": "What is the derivative of x^2?", "options": ["x", "2x", "x^2", "2"], "correct_index": 1, "topic": "derivatives"},
        {"question": "What does an integral represent geometrically?", "options": ["Slope of a line", "Area under a curve", "A single point", "A vector"], "correct_index": 1, "topic": "integrals"},
        {"question": "What is the derivative of a constant?", "options": ["1", "The constant itself", "0", "Undefined"], "correct_index": 2, "topic": "derivatives"},
        {"question": "The limit of a function describes:", "options": ["Its maximum value", "Its behavior as input approaches a value", "Its area", "Its slope everywhere"], "correct_index": 1, "topic": "limits"},
    ],
    "algebra": [
        {"question": "Solve for x: 2x + 4 = 10", "options": ["2", "3", "4", "6"], "correct_index": 1, "topic": "linear equations"},
        {"question": "What is the standard form of a quadratic equation?", "options": ["ax + b = 0", "ax^2 + bx + c = 0", "a/x = b", "a^x = b"], "correct_index": 1, "topic": "quadratics"},
        {"question": "What is the slope of a horizontal line?", "options": ["0", "1", "Undefined", "-1"], "correct_index": 0, "topic": "linear equations"},
    ],
    "physics": [
        {"question": "What is Newton's second law?", "options": ["F = ma", "E = mc^2", "V = IR", "P = mv"], "correct_index": 0, "topic": "mechanics"},
        {"question": "What is the SI unit of force?", "options": ["Joule", "Watt", "Newton", "Pascal"], "correct_index": 2, "topic": "units"},
        {"question": "Which quantity is a vector?", "options": ["Speed", "Mass", "Velocity", "Energy"], "correct_index": 2, "topic": "kinematics"},
    ],
}

_GENERIC_FALLBACK = [
    {"question": "What is the first step when approaching a new problem in {topic}?", "options": ["Memorize formulas", "Identify what you know and what you need", "Guess an answer", "Skip to the hardest part"], "correct_index": 1, "topic": "{topic}"},
    {"question": "Which practice habit helps most when studying {topic}?", "options": ["Only reading notes", "Solving varied problems regularly", "Waiting until the night before", "Avoiding mistakes"], "correct_index": 1, "topic": "{topic}"},
    {"question": "When stuck on a {topic} question, the best move is to:", "options": ["Give up immediately", "Break it into smaller parts", "Copy someone else's work", "Change the subject"], "correct_index": 1, "topic": "{topic}"},
    {"question": "A strong answer in {topic} usually includes:", "options": ["Only the final number", "Clear reasoning and units", "A guess with no work", "Random keywords"], "correct_index": 1, "topic": "{topic}"},
]


def _fallback_questions(topic: str, num_questions: int) -> list[QuizQuestion]:
    key = next((k for k in _FALLBACK_BANK if k in topic.lower()), None)
    bank = _FALLBACK_BANK[key] if key else [
        {**q, "question": q["question"].format(topic=topic)} for q in _GENERIC_FALLBACK
    ]
    # Cycle through the bank if num_questions exceeds what's available
    selected = [bank[i % len(bank)] for i in range(num_questions)]
    return [QuizQuestion(**q) for q in selected]


def _parse_llm_questions(raw_text: str) -> list[QuizQuestion] | None:
    """Extracts a JSON array of questions from the LLM's raw text response."""
    # Try a non-greedy match first; if that fails, try to raw-decode from the first '['.
    match = re.search(r"\[.*?\]", raw_text, re.DOTALL)
    candidates = [match.group(0)] if match else []

    first_bracket = raw_text.find("[")
    if first_bracket != -1:
        candidates.append(raw_text[first_bracket:])

    for candidate in candidates:
        try:
            items = json.loads(candidate)
            if isinstance(items, list) and items:
                return [QuizQuestion(**item) for item in items]
        except (json.JSONDecodeError, TypeError, ValueError):
            continue
    return None


def generate_quiz(topic: str, quiz_type: str = "post_session", num_questions: int = 4) -> list[QuizQuestion]:
    """
    Generates `num_questions` MCQs about `topic`.

    Tries a real LLM call first; falls back to a static bank on any
    failure (no key, timeout, malformed response). Never raises and
    never returns an empty list for a non-empty topic.
    """
    prompt = (
        f"Generate exactly {num_questions} multiple-choice questions to test "
        f"understanding of: {topic}. This is a {quiz_type} quiz.\n"
        f"Respond with ONLY a JSON array, no other text, in this exact shape:\n"
        f'[{{"question": "...", "options": ["...", "...", "...", "..."], '
        f'"correct_index": 0, "topic": "short subtopic label"}}]'
    )
    raw = call_llm(prompt)
    if raw:
        parsed = _parse_llm_questions(raw)
        if parsed:
            return parsed[:num_questions]

    return _fallback_questions(topic, num_questions)


def grade_quiz(questions: list[QuizQuestion], student_answers: list[int]) -> QuizResult:
    """
    Compares `student_answers` (one index per question, same order as
    `questions`) against each question's correct_index.

    Mismatched lengths are handled gracefully: unanswered questions
    count as wrong, never raise an IndexError.
    """
    total = len(questions)
    if total == 0:
        return QuizResult(score=0, total=0, passed=False, weak_topics=[])

    score = 0
    weak_topics: list[str] = []
    for i, q in enumerate(questions):
        given = student_answers[i] if i < len(student_answers) else -1
        if given == q.correct_index:
            score += 1
        elif q.topic and q.topic not in weak_topics:
            weak_topics.append(q.topic)

    passed = (score / total) >= PASS_THRESHOLD
    return QuizResult(score=score, total=total, passed=passed, weak_topics=weak_topics)
