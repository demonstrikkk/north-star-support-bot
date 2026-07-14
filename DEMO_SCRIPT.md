# 2–3 minute demo script

## 0:00–0:12 — Introduction

“This is North Star Support Bot, a responsive customer-support experience for an outdoor retailer. It requires no API key and uses deterministic business rules for every factual response.”

## 0:12–0:38 — Order tracking

Type: `Can you track order 111?`

Point out the exact status card: **Shipped — Arriving tomorrow**.

Select **Track another order**, enter `999`, and show invalid-order recovery.

## 0:38–0:58 — Returns and exchanges

Type: `Can I exchange something?`

Show the exact 30-day, unused-item, original-packaging policy. Open the simulated returns page briefly and return to chat.

## 0:58–1:25 — Product recommendation

Type: `Help me choose camping gear.`

Choose **Camping**, then **Carrying my gear**. Show the resulting category recommendation and explanation.

## 1:25–1:42 — Shipping information

Type: `How fast is expedited shipping?`

Show the exact standard and expedited times.

## 1:42–2:02 — Fallback

Type: `Can you repair my bicycle?`

Show the clear fallback and supported quick actions. Enter another unsupported request to show escalation.

## 2:02–2:22 — Human handoff

Choose **Live agent**, then **Return**. Show the simulated handoff state and preserved context. Use **Return to main menu**.

## 2:22–2:35 — Closing

“The repository includes automated tests, a scenario matrix, a compiled frontend, and a one-process FastAPI run path for immediate evaluation.”
