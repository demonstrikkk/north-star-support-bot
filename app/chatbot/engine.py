from __future__ import annotations

from app.chatbot.entity_extractor import extract_order_number
from app.chatbot.intent_router import detect_global_command, resolve_intent
from app.schemas.chat import (
    ChatAction,
    ChatMessage,
    ChatResponse,
    ConversationState,
    Intent,
    SessionState,
)
from app.services.order_service import lookup_order
from app.services.recommendation_service import (
    get_question,
    normalize_activity,
    normalize_preference,
    recommend,
)


MAIN_ACTIONS = [
    ChatAction(label="Track my order", value="intent_order_tracking", icon="package", variant="primary"),
    ChatAction(label="Returns & exchanges", value="intent_returns", icon="rotate-ccw"),
    ChatAction(label="Recommend gear", value="intent_recommendation", icon="mountain"),
    ChatAction(label="Shipping information", value="intent_shipping", icon="truck"),
    ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
]


def _response(
    session_id: str,
    session: SessionState,
    intent: Intent,
    messages: list[ChatMessage],
    actions: list[ChatAction] | None = None,
) -> ChatResponse:
    return ChatResponse(
        session_id=session_id,
        intent=intent,
        state=session.state,
        messages=messages,
        actions=actions or [],
    )


def _set_state(session: SessionState, state: ConversationState) -> None:
    if session.state != state:
        session.previous_state = session.state
        session.state = state


def welcome(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count = 0
    _set_state(session, ConversationState.MAIN_MENU)
    return _response(
        session_id,
        session,
        Intent.MAIN_MENU,
        [
            ChatMessage(
                type="welcome",
                title="Hi there! I’m North Star Support Bot.",
                text=(
                    "I can help track orders, explain returns, recommend outdoor gear categories, "
                    "answer shipping questions, or connect you with a simulated live agent."
                ),
                subtitle="How can I help today?",
            )
        ],
        MAIN_ACTIONS,
    )


def _main_menu(session_id: str, session: SessionState) -> ChatResponse:
    session.recommendation_activity = None
    session.recommendation_preference = None
    session.handoff_issue = None
    return welcome(session_id, session)


def _start_order(session_id: str, session: SessionState, order_number: str | None = None) -> ChatResponse:
    session.fallback_count = 0
    if order_number:
        return _resolve_order(session_id, session, order_number)
    _set_state(session, ConversationState.AWAITING_ORDER_NUMBER)
    return _response(
        session_id,
        session,
        Intent.ORDER_TRACKING,
        [ChatMessage(type="text", text="I can help with that. What is your order number?")],
        [
            ChatAction(label="Use order 111", value="order_111", icon="package"),
            ChatAction(label="Use order 222", value="order_222", icon="package"),
            ChatAction(label="Use order 333", value="order_333", icon="package"),
            ChatAction(label="Main menu", value="main_menu", icon="home", variant="ghost"),
        ],
    )


def _resolve_order(session_id: str, session: SessionState, order_number: str) -> ChatResponse:
    session.fallback_count = 0
    order = lookup_order(order_number)
    if not order:
        _set_state(session, ConversationState.AWAITING_ORDER_NUMBER)
        return _response(
            session_id,
            session,
            Intent.ORDER_TRACKING,
            [
                ChatMessage(
                    type="order_status",
                    title=f"Order #{order_number}",
                    status="Not found",
                    detail="I couldn’t find that order number. Please check it and try again.",
                    data={"valid": False, "order_number": order_number},
                )
            ],
            [
                ChatAction(label="Try another order number", value="track_another", icon="search", variant="primary"),
                ChatAction(label="Main menu", value="main_menu", icon="home"),
                ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
            ],
        )

    _set_state(session, ConversationState.ORDER_RESOLVED)
    actions = [
        ChatAction(label="Track another order", value="track_another", icon="search", variant="primary"),
        ChatAction(label="Main menu", value="main_menu", icon="home"),
        ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
    ]
    if order_number == "333":
        actions = [
            ChatAction(label="Yes, everything arrived", value="delivered_ok", icon="check", variant="primary"),
            ChatAction(label="No, I need help", value="delivered_help", icon="headphones"),
            ChatAction(label="Main menu", value="main_menu", icon="home"),
        ]
    return _response(
        session_id,
        session,
        Intent.ORDER_TRACKING,
        [
            ChatMessage(
                type="order_status",
                title=f"Order #{order_number}",
                status=str(order["status"]),
                detail=str(order["detail"]),
                data={
                    "valid": True,
                    "order_number": order_number,
                    "step": int(order["step"]),
                },
            )
        ],
        actions,
    )


def _returns(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count = 0
    _set_state(session, ConversationState.RETURNS_RESOLVED)
    return _response(
        session_id,
        session,
        Intent.RETURNS_EXCHANGE,
        [
            ChatMessage(
                type="policy_card",
                title="Returns & exchanges",
                text="North Star accepts returns within 30 days.",
                data={
                    "requirements": ["The item must be unused", "The original packaging is required"],
                    "returns_path": "/returns",
                },
            )
        ],
        [
            ChatAction(label="Open simulated returns page", value="open_returns", icon="external-link", variant="primary"),
            ChatAction(label="Review shipping information", value="intent_shipping", icon="truck"),
            ChatAction(label="Main menu", value="main_menu", icon="home"),
            ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
        ],
    )


def _shipping(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count = 0
    _set_state(session, ConversationState.SHIPPING_RESOLVED)
    return _response(
        session_id,
        session,
        Intent.SHIPPING_INFORMATION,
        [
            ChatMessage(
                type="shipping_card",
                title="Shipping information",
                data={
                    "standard": "3–5 business days",
                    "expedited": "1–2 business days",
                },
            )
        ],
        [
            ChatAction(label="Track an order", value="intent_order_tracking", icon="package", variant="primary"),
            ChatAction(label="Main menu", value="main_menu", icon="home"),
            ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
        ],
    )


def _start_recommendation(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count = 0
    session.recommendation_activity = None
    session.recommendation_preference = None
    _set_state(session, ConversationState.RECOMMENDATION_ACTIVITY)
    return _response(
        session_id,
        session,
        Intent.PRODUCT_RECOMMENDATION,
        [
            ChatMessage(
                type="recommendation_question",
                title="Let’s find the right gear category",
                text="What kind of outdoor activity are you planning?",
                data={"step": 1, "total_steps": 2},
            )
        ],
        [
            ChatAction(label="Hiking", value="activity_hiking", icon="footprints", variant="primary"),
            ChatAction(label="Camping", value="activity_camping", icon="tent"),
            ChatAction(label="Backpacking", value="activity_backpacking", icon="backpack"),
            ChatAction(label="Cold-weather adventure", value="activity_cold_weather", icon="snowflake"),
            ChatAction(label="Main menu", value="main_menu", icon="home", variant="ghost"),
        ],
    )


def _recommendation_activity(
    session_id: str, session: SessionState, activity: str | None
) -> ChatResponse:
    if not activity:
        return _response(
            session_id,
            session,
            Intent.PRODUCT_RECOMMENDATION,
            [ChatMessage(type="text", text="Please choose hiking, camping, backpacking, or a cold-weather adventure.")],
            [ChatAction(label="Show choices", value="intent_recommendation", variant="primary")],
        )

    session.recommendation_activity = activity
    _set_state(session, ConversationState.RECOMMENDATION_PREFERENCE)
    question, options = get_question(activity)
    return _response(
        session_id,
        session,
        Intent.PRODUCT_RECOMMENDATION,
        [
            ChatMessage(
                type="recommendation_question",
                title="One more detail",
                text=question,
                data={"step": 2, "total_steps": 2, "activity": activity},
            )
        ],
        [ChatAction(label=label, value=value, variant="primary" if index == 0 else "secondary") for index, (label, value) in enumerate(options)]
        + [ChatAction(label="Back", value="back", icon="arrow-left", variant="ghost")],
    )


def _recommendation_result(
    session_id: str, session: SessionState, preference: str | None
) -> ChatResponse:
    activity = session.recommendation_activity
    if not activity or not preference:
        return _start_recommendation(session_id, session)
    result = recommend(activity, preference)
    if not result:
        return _start_recommendation(session_id, session)
    session.recommendation_preference = preference
    _set_state(session, ConversationState.RECOMMENDATION_RESOLVED)
    category, reason = result
    return _response(
        session_id,
        session,
        Intent.PRODUCT_RECOMMENDATION,
        [
            ChatMessage(
                type="recommendation_result",
                title=category,
                text=reason,
                data={"activity": activity, "preference": preference},
            )
        ],
        [
            ChatAction(label="Start another recommendation", value="intent_recommendation", icon="sparkles", variant="primary"),
            ChatAction(label="Main menu", value="main_menu", icon="home"),
            ChatAction(label="Talk to a live agent", value="intent_handoff", icon="headphones"),
        ],
    )


def _start_handoff(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count = 0
    _set_state(session, ConversationState.LIVE_AGENT_CONTEXT)
    return _response(
        session_id,
        session,
        Intent.HUMAN_HANDOFF,
        [
            ChatMessage(
                type="text",
                title="I’ll prepare a simulated handoff.",
                text="What do you need help with?",
            )
        ],
        [
            ChatAction(label="Order", value="handoff_order", icon="package", variant="primary"),
            ChatAction(label="Return", value="handoff_return", icon="rotate-ccw"),
            ChatAction(label="Product advice", value="handoff_product", icon="mountain"),
            ChatAction(label="Something else", value="handoff_other", icon="message-circle"),
            ChatAction(label="Main menu", value="main_menu", icon="home", variant="ghost"),
        ],
    )


def _complete_handoff(session_id: str, session: SessionState, issue: str) -> ChatResponse:
    labels = {
        "order": "Order assistance",
        "return": "Return assistance",
        "product": "Product advice",
        "other": "Something else",
    }
    session.handoff_issue = labels.get(issue, issue.title())
    _set_state(session, ConversationState.LIVE_AGENT)
    return _response(
        session_id,
        session,
        Intent.HUMAN_HANDOFF,
        [
            ChatMessage(
                type="live_agent",
                title="Live Agent Handoff",
                status="Simulated handoff active",
                detail="In a production system, a support representative would continue from here.",
                data={"issue": session.handoff_issue, "context_preserved": True},
            )
        ],
        [
            ChatAction(label="Continue with chatbot", value="continue_chatbot", icon="message-circle", variant="primary"),
            ChatAction(label="Return to main menu", value="main_menu", icon="home"),
        ],
    )


def _fallback(session_id: str, session: SessionState) -> ChatResponse:
    session.fallback_count += 1
    _set_state(session, ConversationState.FALLBACK)
    if session.fallback_count >= 2:
        return _response(
            session_id,
            session,
            Intent.FALLBACK,
            [
                ChatMessage(
                    type="fallback",
                    title="I’m still having trouble understanding the request.",
                    text="Would you like to return to the main menu or move to the simulated Live Agent?",
                    data={"attempt": session.fallback_count},
                )
            ],
            [
                ChatAction(label="Main menu", value="main_menu", icon="home", variant="primary"),
                ChatAction(label="Live agent", value="intent_handoff", icon="headphones"),
            ],
        )
    return _response(
        session_id,
        session,
        Intent.FALLBACK,
        [
            ChatMessage(
                type="fallback",
                title="I’m sorry, I didn’t understand that.",
                text="I can help with order tracking, returns, product recommendations, shipping information, or live agent support.",
                data={"attempt": session.fallback_count},
            )
        ],
        MAIN_ACTIONS,
    )


def process_chat(
    session_id: str,
    session: SessionState,
    message: str = "",
    action: str | None = None,
) -> ChatResponse:
    if action == "welcome":
        return welcome(session_id, session)

    if action:
        if action in {"main_menu", "continue_chatbot"}:
            return _main_menu(session_id, session)
        if action == "restart":
            session.__dict__.update(SessionState().__dict__)
            return welcome(session_id, session)
        if action in {"back", "go_back"}:
            if session.state == ConversationState.RECOMMENDATION_PREFERENCE:
                return _start_recommendation(session_id, session)
            return _main_menu(session_id, session)
        if action == "intent_order_tracking" or action == "track_another":
            return _start_order(session_id, session)
        if action.startswith("order_"):
            return _resolve_order(session_id, session, action.split("_", 1)[1])
        if action == "intent_returns":
            return _returns(session_id, session)
        if action == "intent_shipping":
            return _shipping(session_id, session)
        if action == "intent_recommendation":
            return _start_recommendation(session_id, session)
        if action.startswith("activity_"):
            return _recommendation_activity(session_id, session, action.replace("activity_", "", 1))
        if action.startswith("pref_"):
            return _recommendation_result(session_id, session, action.replace("pref_", "", 1))
        if action == "intent_handoff" or action == "delivered_help":
            return _start_handoff(session_id, session)
        if action.startswith("handoff_"):
            return _complete_handoff(session_id, session, action.replace("handoff_", "", 1))
        if action == "delivered_ok":
            return _response(
                session_id,
                session,
                Intent.ORDER_TRACKING,
                [ChatMessage(type="text", text="Great — I’m glad everything arrived. Is there anything else I can help with?")],
                MAIN_ACTIONS,
            )

    command = detect_global_command(message)
    if command == Intent.MAIN_MENU:
        return _main_menu(session_id, session)
    if command == Intent.RESTART:
        session.__dict__.update(SessionState().__dict__)
        return welcome(session_id, session)
    if command == Intent.BACK:
        if session.state == ConversationState.RECOMMENDATION_PREFERENCE:
            return _start_recommendation(session_id, session)
        return _main_menu(session_id, session)

    # Explicit human requests and strong flow interruptions must work from any state.
    match = resolve_intent(message)
    extracted_order = extract_order_number(message)
    if match.intent == Intent.HUMAN_HANDOFF and match.confidence >= 0.72:
        return _start_handoff(session_id, session)
    if session.state != ConversationState.MAIN_MENU:
        if match.intent == Intent.ORDER_TRACKING and match.confidence >= 0.79:
            return _start_order(session_id, session, extracted_order)
        if match.intent == Intent.RETURNS_EXCHANGE and match.confidence >= 0.82:
            return _returns(session_id, session)
        if match.intent == Intent.SHIPPING_INFORMATION and match.confidence >= 0.82:
            return _shipping(session_id, session)
        if match.intent == Intent.PRODUCT_RECOMMENDATION and match.confidence >= 0.84:
            return _start_recommendation(session_id, session)

    if session.state == ConversationState.AWAITING_ORDER_NUMBER:
        order_number = extracted_order
        if order_number:
            return _resolve_order(session_id, session, order_number)
        return _response(
            session_id,
            session,
            Intent.ORDER_TRACKING,
            [ChatMessage(type="text", text="Please enter a numeric order number, such as 111, 222, or 333.")],
            [ChatAction(label="Main menu", value="main_menu", icon="home")],
        )

    if session.state == ConversationState.RECOMMENDATION_ACTIVITY:
        activity = normalize_activity(message)
        return _recommendation_activity(session_id, session, activity)

    if session.state == ConversationState.RECOMMENDATION_PREFERENCE:
        preference = normalize_preference(message)
        return _recommendation_result(session_id, session, preference)

    if session.state == ConversationState.LIVE_AGENT_CONTEXT:
        issue = message.strip() or "Something else"
        return _complete_handoff(session_id, session, issue)

    if extracted_order and match.intent == Intent.ORDER_TRACKING:
        return _start_order(session_id, session, extracted_order)

    if match.intent == Intent.ORDER_TRACKING:
        return _start_order(session_id, session, extracted_order)
    if match.intent == Intent.RETURNS_EXCHANGE:
        return _returns(session_id, session)
    if match.intent == Intent.PRODUCT_RECOMMENDATION:
        return _start_recommendation(session_id, session)
    if match.intent == Intent.SHIPPING_INFORMATION:
        return _shipping(session_id, session)
    if match.intent == Intent.HUMAN_HANDOFF:
        return _start_handoff(session_id, session)
    return _fallback(session_id, session)
