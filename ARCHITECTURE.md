# Architecture

```text
Responsive React Interface
        │
        ▼
FastAPI POST /api/chat
        │
        ▼
Conversation Engine
  ├── global commands
  ├── state-aware input handling
  ├── entity extraction
  ├── exact phrase matching
  ├── weighted keywords
  ├── RapidFuzz typo tolerance
  └── progressive fallback
        │
        ▼
Deterministic Business Services
  ├── order lookup
  ├── return policy
  ├── shipping information
  ├── category recommendation
  └── simulated handoff
```

## Frontend responsibilities

- Render structured response types rather than parsing generated prose
- Provide responsive desktop, tablet, and mobile layouts
- Present accessible quick actions, cards, progress states, and error handling
- Animate hierarchy and feedback without obscuring the core workflow
- Route to the local simulated returns portal

## Backend responsibilities

- Own conversation state and business truth
- Normalize text and extract order numbers
- Detect intent using deterministic NLP techniques
- Preserve exact supplied order, return, and shipping data
- Refuse unsupported details through fallback or handoff
- Return structured UI payloads

## State model

- `main_menu`
- `awaiting_order_number`
- `order_resolved`
- `recommendation_activity`
- `recommendation_preference`
- `recommendation_resolved`
- `returns_resolved`
- `shipping_resolved`
- `live_agent_context`
- `live_agent`
- `fallback`

## Future production evolution

A production system could add authenticated customer order history, real ecommerce APIs, retrieval-grounded FAQ search, CRM handoff, analytics, and a constrained LLM for ambiguous intent classification. Those additions are intentionally excluded from the evaluator-critical build.
