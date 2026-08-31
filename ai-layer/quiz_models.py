"""
Data contracts for the quiz module. Separate from models.py (which is the
recommendation module's contract) so the two features can evolve independently.
"""
from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=2, max_length=6)
    correct_index: int
    topic: str = ""  # subtopic label, used to build weak_topics after grading


class QuizResult(BaseModel):
    score: int
    total: int
    passed: bool
    weak_topics: list[str]
