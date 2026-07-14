# Test scenarios

| ID | Input/action | Starting state | Expected result |
|---|---|---|---|
| OT-01 | Where is my order? | Main menu | Ask for order number |
| OT-02 | Track my package | Main menu | Ask for order number |
| OT-03 | Track order 111 | Main menu | Shipped, arriving tomorrow |
| OT-04 | Where is #222? | Main menu | Processing, ships in 24 hours |
| OT-05 | Has order 333 arrived? | Main menu | Delivered |
| OT-06 | Track order 999 | Main menu | Invalid order |
| OT-07 | trak my pakage | Main menu | Ask for order number |
| OT-08 | 111 | Awaiting order | Exact 111 result |
| OT-09 | abc | Awaiting order | Ask for numeric order number |
| OT-10 | Track another order | Resolved | Ask for order number |
| RT-01 | What is your return policy? | Main menu | Exact policy |
| RT-02 | Can I exchange this? | Main menu | Exact policy |
| RT-03 | I want a refund | Main menu | Exact policy |
| RT-04 | retun an item | Main menu | Exact policy |
| RT-05 | I received my order and want to return it | Main menu | Returns wins collision |
| RT-06 | Open simulated returns page | Returns | Local `/returns` page |
| SH-01 | How long does shipping take? | Main menu | Exact shipping times |
| SH-02 | What is expedited shipping? | Main menu | 1–2 business days |
| SH-03 | Standard shipping time | Main menu | 3–5 business days |
| PR-01 | Recommend gear | Main menu | Ask activity |
| PR-02 | Hiking | Recommendation activity | Ask conditions |
| PR-03 | Rainy | Recommendation preference | Waterproof hiking apparel |
| PR-04 | Camping + vehicle | Recommendation | Spacious camping shelters |
| PR-05 | Camping + carrying | Recommendation | Lightweight camping equipment |
| PR-06 | Backpacking + lower weight | Recommendation | Ultralight categories |
| PR-07 | Backpacking + comfort | Recommendation | Supportive/insulated categories |
| PR-08 | Cold weather + clothing | Recommendation | Insulated apparel |
| PR-09 | Cold weather + sleeping | Recommendation | Cold-weather sleeping category |
| HH-01 | Talk to a human | Main menu | Ask handoff context |
| HH-02 | Return | Handoff context | Simulated Live Agent state |
| HH-03 | Continue with chatbot | Live Agent | Main menu |
| HH-04 | Return to main menu | Live Agent | Main menu |
| FB-01 | Repair my bicycle | Main menu | First fallback and options |
| FB-02 | Book me a flight | First fallback | Second fallback, menu/handoff |
| FB-03 | Track order 111 | Fallback | Reset fallback count and resolve |
| NAV-01 | main menu | Any flow | Main menu |
| NAV-02 | restart | Any flow | Fresh welcome |
| NAV-03 | back | Recommendation preference | Activity step |
| NAV-04 | cancel | Any flow | Main menu |
| INT-01 | Actually, track order 222 | Recommendation | Interrupt and resolve order |
| INT-02 | I want a return | Order flow | Interrupt and show policy |
| INT-03 | Human please | Any flow | Handoff flow |
| UX-01 | Empty submit | Any | No request sent |
| UX-02 | Repeated click while waiting | Any | Controls temporarily disabled |
| UX-03 | Mobile viewport | Any | No horizontal overflow |
| UX-04 | Keyboard Enter | Composer | Send message |
| UX-05 | Shift+Enter | Composer | Newline retained |
