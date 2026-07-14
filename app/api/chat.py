from __future__ import annotations

from fastapi import APIRouter

from app.chatbot.engine import process_chat, welcome
from app.chatbot.sessions import session_store
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.conversation_logger import log_chat

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    session = session_store.get(request.session_id)
    response = process_chat(
        session_id=request.session_id,
        session=session,
        message=request.message,
        action=request.action,
    )
    log_chat(
        session_id=request.session_id,
        session=session,
        user_message=request.message,
        user_action=request.action,
        response=response,
    )
    return response


@router.post("/session/{session_id}/reset", response_model=ChatResponse)
def reset_session(session_id: str) -> ChatResponse:
    session = session_store.reset(session_id)
    return welcome(session_id, session)
