"""
Thin LLM wrapper. Returns None on ANY failure (no key, network issue,
timeout, bad response) so callers can fall back safely instead of
crashing mid-demo. This is the ONLY function that should ever change
if you switch LLM providers.
"""
import json
import os
import urllib.request
import urllib.error

DEFAULT_ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022"
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
TIMEOUT_SECONDS = 10


def call_llm(prompt: str, max_tokens: int = 1000) -> str | None:
    """
    Sends `prompt` to the configured LLM and returns the text response,
    or None if no key is set or the call fails for any reason.

    Env vars are read inside this function (not at import time) so that
    callers can load a .env file before the first LLM call.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    model = os.environ.get("ANTHROPIC_MODEL", DEFAULT_ANTHROPIC_MODEL).strip() or DEFAULT_ANTHROPIC_MODEL
    if not api_key:
        return None

    body = json.dumps({
        "model": model,
        "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            parts = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
            return "\n".join(parts) if parts else None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError, ValueError):
        return None
