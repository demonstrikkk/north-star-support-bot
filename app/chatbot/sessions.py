from __future__ import annotations

from app.schemas.chat import SessionState


class SessionStore:
    def __init__(self) -> None:
        self._sessions: dict[str, SessionState] = {}

    def get(self, session_id: str) -> SessionState:
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionState()
        return self._sessions[session_id]

    def reset(self, session_id: str) -> SessionState:
        self._sessions[session_id] = SessionState()
        return self._sessions[session_id]


session_store = SessionStore()
