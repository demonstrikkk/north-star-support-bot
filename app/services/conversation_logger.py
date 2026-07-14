from __future__ import annotations

import json
import logging
import os
import time
from threading import Lock
from typing import Any

from app.schemas.chat import ChatResponse, SessionState

logger = logging.getLogger("conversation_logger")

LOG_DIR = os.getenv("CONVERSATION_LOG_DIR", "logs")
os.makedirs(LOG_DIR, exist_ok=True)

_lock = Lock()


def _log_entry(entry: dict[str, Any]) -> None:
    filename = os.path.join(LOG_DIR, f"conversations-{time.strftime('%Y-%m-%d')}.jsonl")
    with _lock:
        try:
            with open(filename, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, default=str) + "\n")
        except OSError as exc:
            logger.error("Failed to write conversation log: %s", exc)


def log_chat(
    session_id: str,
    session: SessionState,
    user_message: str,
    user_action: str | None,
    response: ChatResponse,
) -> None:
    entry: dict[str, Any] = {
        "event": "chat",
        "session_id": session_id,
        "timestamp": time.time(),
        "iso_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "user_message": user_message,
        "user_action": user_action,
        "response_intent": response.intent.value if hasattr(response.intent, "value") else str(response.intent),
        "response_state": response.state.value if hasattr(response.state, "value") else str(response.state),
        "messages": [m.model_dump() for m in response.messages],
        "actions": [a.model_dump() for a in response.actions],
        "session_state": session.model_dump(),
    }
    _log_entry(entry)


def log_chat_end(
    session_id: str,
    session: SessionState,
    satisfaction: int | None = None,
) -> None:
    entry: dict[str, Any] = {
        "event": "chat_end",
        "session_id": session_id,
        "timestamp": time.time(),
        "iso_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "satisfaction": satisfaction,
        "session_state": session.model_dump(),
    }
    _log_entry(entry)
