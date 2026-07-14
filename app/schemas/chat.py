from __future__ import annotations

from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, Field


class Intent(StrEnum):
    ORDER_TRACKING = "order_tracking"
    RETURNS_EXCHANGE = "returns_exchange"
    PRODUCT_RECOMMENDATION = "product_recommendation"
    SHIPPING_INFORMATION = "shipping_information"
    HUMAN_HANDOFF = "human_handoff"
    MAIN_MENU = "main_menu"
    RESTART = "restart"
    BACK = "back"
    FALLBACK = "fallback"
    UNKNOWN = "unknown"


class ConversationState(StrEnum):
    MAIN_MENU = "main_menu"
    AWAITING_ORDER_NUMBER = "awaiting_order_number"
    ORDER_RESOLVED = "order_resolved"
    RECOMMENDATION_ACTIVITY = "recommendation_activity"
    RECOMMENDATION_PREFERENCE = "recommendation_preference"
    RECOMMENDATION_RESOLVED = "recommendation_resolved"
    RETURNS_RESOLVED = "returns_resolved"
    SHIPPING_RESOLVED = "shipping_resolved"
    LIVE_AGENT_CONTEXT = "live_agent_context"
    LIVE_AGENT = "live_agent"
    FALLBACK = "fallback"


class SessionState(BaseModel):
    state: ConversationState = ConversationState.MAIN_MENU
    previous_state: ConversationState | None = None
    fallback_count: int = Field(default=0, ge=0)
    recommendation_activity: str | None = None
    recommendation_preference: str | None = None
    handoff_issue: str | None = None


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=100)
    message: str = Field(default="", max_length=2000)
    action: str | None = Field(default=None, max_length=100)


class ChatAction(BaseModel):
    label: str
    value: str
    icon: str | None = None
    variant: Literal["primary", "secondary", "ghost", "danger"] = "secondary"


class ChatMessage(BaseModel):
    type: Literal[
        "text",
        "welcome",
        "order_status",
        "policy_card",
        "shipping_card",
        "recommendation_question",
        "recommendation_result",
        "live_agent",
        "fallback",
        "error",
    ]
    text: str | None = None
    title: str | None = None
    subtitle: str | None = None
    status: str | None = None
    detail: str | None = None
    data: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    session_id: str
    intent: Intent
    state: ConversationState
    messages: list[ChatMessage]
    actions: list[ChatAction] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
