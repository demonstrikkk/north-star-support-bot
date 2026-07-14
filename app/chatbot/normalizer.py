from __future__ import annotations

import re

CONTRACTIONS = {
    "where's": "where is",
    "what's": "what is",
    "can't": "cannot",
    "i'd": "i would",
    "i'm": "i am",
    "hasn't": "has not",
    "haven't": "have not",
    "didn't": "did not",
    "isn't": "is not",
}


def normalize_message(message: str) -> str:
    text = message.lower().strip()
    for source, replacement in CONTRACTIONS.items():
        text = text.replace(source, replacement)
    text = re.sub(r"[^a-z0-9#\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
