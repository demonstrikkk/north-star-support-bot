import pytest

from app.chatbot.entity_extractor import extract_order_number


@pytest.mark.parametrize(
    ("message", "expected"),
    [
        ("Track order 111", "111"),
        ("Where is #222?", "222"),
        ("My order number is 333", "333"),
        ("Check order no. 111", "111"),
        ("No number here", None),
    ],
)
def test_extract_order_number(message: str, expected: str | None):
    assert extract_order_number(message) == expected
