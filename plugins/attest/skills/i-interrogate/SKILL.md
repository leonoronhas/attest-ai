---
name: i-interrogate
description: Use when a task has open decisions that belong to the human — during planning, before building, or when a request's premises deserve a challenge. One question at a time, each with a recommendation attached, inside a fixed budget.
---

# I Interrogate

**Core principle:** Questions are where ownership and judgment get transferred — a decision made silently is a decision nobody owns, and a question asked without a recommendation is work pushed back to the person who delegated it.

## The Iron Law

```
ONE QUESTION AT A TIME, EACH CARRYING A RECOMMENDATION AND ITS REASON
```

A batch of eight questions is a form to fill out. One question with a stated default is a decision to make. Only the second one gets a considered answer.

## The Pass

1. **Sort every open decision into three bins.**
   - **Mechanical** — one defensible answer exists (naming that follows convention, the established pattern for this layer, the obvious data type). Decide silently; log it.
   - **Taste** — multiple defensible answers, and the choice shapes the work (API shape, UX behavior, where a seam goes, what v1 cuts). Ask.
   - **Challenge** — the request itself might be wrong (solves a symptom, duplicates something that exists, conflicts with a prior decision). Ask, and include the strongest case *for* proceeding as requested — a challenge without a steelman is just second-guessing.
2. **Set the budget.** Default ~10 questions, scaled by scope and risk — never by who is asking. A senior gets the same interrogation a junior does; the tier of the work is the only variable.
3. **Spend the budget on Taste and Challenge only.** Every mechanical question asked is a taste question you can no longer afford.
4. **Ask one at a time**, in the form: the question, the options that are actually live, your recommendation, and why. Wait for the answer before the next — later questions should be shaped by earlier answers, which is the whole reason not to batch.
5. **Record every answer as a decision with an owner** — on the issue, in the decision log, wherever the adapter says decisions live. An answer that lives only in chat history is a decision that will be re-litigated.
6. **Publish the silent ones.** The mechanical decisions you made without asking go in the same log as an audit trail — silent must mean *unasked*, never *invisible*, or the ones you got wrong are undiscoverable.

**Agent-driven fallback:** when no human is in the loop, Taste decisions get auto-decided with the full trail — decision, options considered, reason — posted where a human will review it. Auto-decided must always mean contestable-later.

## Verdict

<!-- SPINE: this section is the family contract. Copy it byte-identical
     into every attest skill. Do not paraphrase it per-skill. -->

Every claim gets exactly one of three verdicts:

- **PROVEN** — a command ran this turn and its output confirms the claim. Cite the command and the decisive line.
- **NOT YET** — evidence exists and it says the work is not done. State what is missing. This is a finding, not a failure of the pass.
- **CAN'T PROVE** — no way to verify from this environment (needs staging, another account, a device you don't have, data that doesn't exist here). Goes on the **Unverified List**.

Render the verdict as a table:

```
| # | Claim | Verdict | Evidence (this turn) |
|---|-------|---------|----------------------|
```

**The Unverified List.** Every CAN'T PROVE item must be individually acknowledged by whoever accepts the work — a human reviewer or a gate that records it. A blanket "confirmed" covering multiple unverified items is void. If nothing is unverified, say "Unverified: none" explicitly; silence is not a clean bill.

## Red Flags — Stop

- Composing a message with more than one question mark in it
- A question with no recommendation attached — that's delegating upward
- Asking something the codebase or the adapter already answers
- Auto-deciding a Taste question because asking feels slow
- A challenge with no steelman — critique without the case for the other side
- Adjusting the question count because of who the human is

## Rationalizations

| Excuse | Reality |
|---|---|
| "Batching questions saves round-trips" | It saves your round-trips by spending their attention. Answers degrade after the second question. |
| "They're senior, they don't need the questions" | The questions are how decisions get owners. Seniority changes the answers, not the process. |
| "Asking makes me look unsure" | Asking with a recommendation is the most senior move in the room. |
| "It's faster to just decide" | For Mechanical, yes — that's the bin. For Taste, deciding silently means owning it alone when it's wrong. |
| "The requester knows what they want" | The requester knows the symptom they have. The Challenge bin exists because requests arrive pre-solutioned. |
| "I'll write the decisions down at the end" | The end is after context is gone. Log each answer when it lands. |

## Project Specifics

Read `.claude/attest/project.md` for where decisions are recorded (issue, decision log, tracker) and any tiering that scales the question budget. If it is missing, run `/i-setup` — do not guess.
