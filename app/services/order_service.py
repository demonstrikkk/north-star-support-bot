from __future__ import annotations

ORDER_STATUSES = {
    "111": {"status": "Shipped", "detail": "Arriving tomorrow", "step": 2},
    "222": {"status": "Processing", "detail": "Ships in 24 hours", "step": 1},
    "333": {"status": "Delivered", "detail": "Was everything received as expected?", "step": 4},
}


def lookup_order(order_number: str) -> dict[str, object] | None:
    return ORDER_STATUSES.get(order_number)
