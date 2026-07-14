from __future__ import annotations

from dataclasses import dataclass

from rapidfuzz import fuzz

from app.chatbot.normalizer import normalize_message
from app.schemas.chat import Intent


INTENT_PHRASES: dict[Intent, tuple[str, ...]] = {
    Intent.ORDER_TRACKING: (
        "where is my order",
        "track my order",
        "track my package",
        "track my parcel",
        "order status",
        "has my order shipped",
        "where is my delivery",
        "check my shipment",
        "package has not arrived",
        "check order",
    ),
    Intent.RETURNS_EXCHANGE: (
        "return an item",
        "return my order",
        "exchange an item",
        "return policy",
        "refund policy",
        "send it back",
        "exchange my order",
        "return something",
        "get a refund",
    ),
    Intent.PRODUCT_RECOMMENDATION: (
        "recommend gear",
        "help me choose",
        "what should i buy",
        "product recommendation",
        "suggest camping gear",
        "find outdoor gear",
        "recommend outdoor equipment",
        "help me find gear",
    ),
    Intent.SHIPPING_INFORMATION: (
        "shipping time",
        "how long does shipping take",
        "standard shipping",
        "expedited shipping",
        "delivery times",
        "tell me about shipping",
    ),
    Intent.HUMAN_HANDOFF: (
        "talk to a human",
        "live agent",
        "real person",
        "customer representative",
        "speak with support",
        "human please",
        "talk to someone",
    ),
}

KEYWORD_WEIGHTS: dict[Intent, dict[str, int]] = {
    Intent.ORDER_TRACKING: {
        "track": 5,
        "status": 4,
        "shipment": 4,
        "parcel": 3,
        "package": 3,
        "shipped": 3,
        "delivery": 2,
        "order": 1,
        "where": 1,
    },
    Intent.RETURNS_EXCHANGE: {
        "return": 6,
        "exchange": 6,
        "refund": 6,
        "unused": 3,
        "packaging": 3,
        "send back": 5,
    },
    Intent.PRODUCT_RECOMMENDATION: {
        "recommend": 6,
        "suggest": 5,
        "choose": 5,
        "gear": 3,
        "buy": 3,
        "equipment": 2,
        "hiking": 1,
        "camping": 1,
        "backpacking": 1,
    },
    Intent.SHIPPING_INFORMATION: {
        "shipping": 6,
        "expedited": 5,
        "standard": 3,
        "delivery time": 5,
        "how long": 2,
    },
    Intent.HUMAN_HANDOFF: {
        "human": 6,
        "agent": 6,
        "representative": 6,
        "real person": 6,
        "someone": 2,
    },
}

GLOBAL_COMMANDS: dict[str, Intent] = {
    "main menu": Intent.MAIN_MENU,
    "menu": Intent.MAIN_MENU,
    "home": Intent.MAIN_MENU,
    "restart": Intent.RESTART,
    "start over": Intent.RESTART,
    "reset": Intent.RESTART,
    "go back": Intent.BACK,
    "back": Intent.BACK,
    "cancel": Intent.MAIN_MENU,
}


@dataclass(frozen=True)
class IntentMatch:
    intent: Intent
    confidence: float


def detect_global_command(message: str) -> Intent | None:
    normalized = normalize_message(message)
    return GLOBAL_COMMANDS.get(normalized)


def _weighted_keyword_score(normalized: str, intent: Intent) -> float:
    weights = KEYWORD_WEIGHTS[intent]
    total = 0
    maximum = max(sum(weights.values()), 1)
    for keyword, weight in weights.items():
        if keyword in normalized:
            total += weight
    return min(1.0, total / min(maximum, 12))


def _phrase_score(normalized: str, phrases: tuple[str, ...]) -> float:
    if not normalized:
        return 0.0
    scores = []
    for phrase in phrases:
        scores.extend(
            [
                fuzz.ratio(normalized, phrase),
                fuzz.partial_ratio(normalized, phrase),
                fuzz.token_set_ratio(normalized, phrase),
            ]
        )
    return max(scores, default=0) / 100


def resolve_intent(message: str) -> IntentMatch:
    normalized = normalize_message(message)
    if not normalized:
        return IntentMatch(Intent.FALLBACK, 0.0)

    scores: dict[Intent, float] = {}
    for intent, phrases in INTENT_PHRASES.items():
        phrase = _phrase_score(normalized, phrases)
        keyword = _weighted_keyword_score(normalized, intent)
        scores[intent] = min(1.0, phrase * 0.72 + keyword * 0.38)

    # Explicit action verbs get precedence over broad nouns in mixed messages.
    if any(token in normalized for token in ("return", "exchange", "refund", "send it back")):
        scores[Intent.RETURNS_EXCHANGE] += 0.35
    if any(token in normalized for token in ("track", "order status", "where is", "shipped")):
        scores[Intent.ORDER_TRACKING] += 0.25
    if any(token in normalized for token in ("human", "live agent", "real person", "representative")):
        scores[Intent.HUMAN_HANDOFF] += 0.45

    best_intent, best_score = max(scores.items(), key=lambda item: item[1])
    best_score = min(best_score, 1.0)

    if best_score < 0.58:
        return IntentMatch(Intent.FALLBACK, best_score)
    return IntentMatch(best_intent, best_score)
