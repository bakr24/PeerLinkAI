"""
Text-similarity backend for content matching.

Hackathon-day implementation: TF-IDF + cosine similarity. No API key,
no network call, no per-search cost — good enough to prove the ranking
pipeline works end-to-end.

SWAP-OUT PATH (do this if time/credits allow):
Replace `content_similarity()`'s body with a call to a real embedding
API (OpenAI text-embedding-3-small, or a local sentence-transformers
model) and cosine-similarity the two vectors. The function signature
below does not need to change — recommend.py only depends on this
signature, never on how similarity is computed internally.
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as _sk_cosine


def content_similarity(query: str, documents: list[str]) -> list[float]:
    """
    Returns a similarity score in [0, 1] for `query` against each item
    in `documents`, in the same order as `documents`.

    Empty query or documents list -> all zeros, never raises.
    """
    if not query.strip() or not documents:
        return [0.0] * len(documents)

    corpus = [query] + documents
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        # e.g. corpus is all stopwords / empty after cleaning
        return [0.0] * len(documents)

    query_vec = matrix[0:1]
    doc_vecs = matrix[1:]
    scores = _sk_cosine(query_vec, doc_vecs)[0]
    # cosine similarity of TF-IDF vectors is already in [0, 1] for non-negative vectors
    return [float(max(0.0, min(1.0, s))) for s in scores]
