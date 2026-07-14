from __future__ import annotations

import re

ORDER_PATTERN = re.compile(r"(?:order\s*(?:number|#|no\.?)?\s*)?#?(\d+)", re.IGNORECASE)


def extract_order_number(message: str) -> str | None:
    match = ORDER_PATTERN.search(message)
    if not match:
        return None
    return match.group(1)
