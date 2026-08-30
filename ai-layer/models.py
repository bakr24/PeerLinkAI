"""
Data contracts for the recommendation module.

These are the ONLY objects backend/ should ever construct or read when
calling into ai-layer/. Nothing else in this module's internals should
leak across the boundary.
"""
from pydantic import BaseModel, Field


class LearningStyleVector(BaseModel):
    """4-dimension learning-style rubric, each bounded 0.0-1.0."""
    visual: float = Field(ge=0.0, le=1.0, default=0.5)
    practical: float = Field(ge=0.0, le=1.0, default=0.5)
    pace: float = Field(ge=0.0, le=1.0, default=0.5)  # 0 = slow/thorough, 1 = fast/dense
    interaction: float = Field(ge=0.0, le=1.0, default=0.5)  # 0 = independent, 1 = wants Q&A

    def as_tuple(self) -> tuple[float, float, float, float]:
        return (self.visual, self.practical, self.pace, self.interaction)


class StudentProfile(BaseModel):
    student_id: str
    learning_style: LearningStyleVector


class TutorProfile(BaseModel):
    tutor_id: str
    name: str
    subject: str
    bio: str
    teaching_style_tags: str = ""  # free text, e.g. "hands-on, visual, patient"
    teaching_style: LearningStyleVector


class RecommendationResult(BaseModel):
    tutor_id: str
    name: str
    final_score: float
    content_score: float
    style_score: float
    reason: str
