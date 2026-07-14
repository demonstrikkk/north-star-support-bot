import pytest

from app.chatbot.intent_router import resolve_intent
from app.schemas.chat import Intent


@pytest.mark.parametrize(
    ("message", "expected"),
    [
        ("Where is my order?", Intent.ORDER_TRACKING),
        ("Track my package", Intent.ORDER_TRACKING),
        ("Has my parcel shipped?", Intent.ORDER_TRACKING),
        ("trak my pakage", Intent.ORDER_TRACKING),
        ("I want a refund", Intent.RETURNS_EXCHANGE),
        ("Can I exchange this?", Intent.RETURNS_EXCHANGE),
        ("What is your return policy?", Intent.RETURNS_EXCHANGE),
        ("retun an item", Intent.RETURNS_EXCHANGE),
        ("Recommend gear", Intent.PRODUCT_RECOMMENDATION),
        ("Help me choose camping equipment", Intent.PRODUCT_RECOMMENDATION),
        ("recomend outdoor gear", Intent.PRODUCT_RECOMMENDATION),
        ("Talk to a human", Intent.HUMAN_HANDOFF),
        ("Real person please", Intent.HUMAN_HANDOFF),
        ("speek to support", Intent.HUMAN_HANDOFF),
        ("How long does shipping take?", Intent.SHIPPING_INFORMATION),
        ("What is expedited shipping?", Intent.SHIPPING_INFORMATION),
        ("Repair my bicycle", Intent.FALLBACK),
    ],
)
def test_intent_variations(message: str, expected: Intent):
    assert resolve_intent(message).intent == expected


def test_returns_precedes_generic_order_wording():
    assert resolve_intent("I received my order and want to return it").intent == Intent.RETURNS_EXCHANGE


def test_returns_precedes_shipping_context():
    assert resolve_intent("How long after delivery can I return this?").intent == Intent.RETURNS_EXCHANGE
