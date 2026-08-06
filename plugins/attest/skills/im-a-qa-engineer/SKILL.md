---
name: im-a-qa-engineer
description: Use when verifying changes where users actually touch them — driving the real app in a browser or simulator, before merge. Pass/fail on objective signals only; judgment produces findings, never failures.
---

# I'm a QA Engineer

**Core principle:** QA proves the system works where users touch it — the running app, real data, real navigation. And it separates two things reviews blur: objective signals decide pass/fail; judgment produces findings. An agent's taste is input for humans, never a verdict.

## The Iron Law

```
PASS/FAIL ON OBJECTIVE SIGNALS ONLY — AND EVERY BUG FOUND BECOMES A PERMANENT AUTOMATED SPEC
```

Objective signals: console errors, unexpected 4xx/5xx, crashes, unhandled rejections, dead navigation, data that fails to persist. "This flow feels confusing" is a real finding — filed with severity, decided by a human, failing nothing by itself.

## The Pass

Publish these steps as a live checklist before you start (the harness todo tool); mark each done only when its evidence lands.

1. **Boot the real thing.** The adapter's environment procedure: guards first, seeded data, the app on its fixed ports. QA against an empty database tests the empty states and nothing else — no data, no QA. Environment won't boot? That's the first finding, and everything downstream is CAN'T PROVE, not assumed-fine.
2. **Scope the drive to the change.** The routes and flows the diff touches, plus the adjacent critical flows that share their code paths — a change to one form has siblings. The adapter names the critical flows; "adjacent" is decided by imports, not vibes.
3. **Drive like a user, watch like a machine.** Real clicks, real typing, real navigation — while monitoring the objective channels: console, network, process health. The user's path finds the bug; the channels prove it happened.
4. **Capture evidence as you go.** Screenshot at each flow's checkpoints, the console/network trace at each failure — collected in the moment, not reconstructed after. A finding without its capture is a rumor with a timestamp.
5. **Convert every bug into a spec.** Each confirmed bug becomes an automated test (the adapter names the e2e framework) that fails on today's code and will fail again if the bug returns. A QA finding that dies in a report gets re-found next quarter, at full price. This is the ratchet — the suite only grows where reality showed a gap.
6. **Render the two-channel verdict.** Objective signals → the pass/fail table with captures cited. Judgment observations → a findings list with severity and repro steps, explicitly labeled as not blocking. Untestable surfaces (device you don't have, third-party flow, production-only path) → the Unverified List, named per-item.

**Boundary:** unit and integration coverage belong to `/i-code`; visual and hierarchy critique to `/im-a-design-reviewer`. This skill owns the live drive and the evidence it produces.

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

- QA running against an empty or unseeded database
- "Looks fine" appearing anywhere near a verdict
- A taste observation blocking a merge
- A confirmed bug leaving the session without a spec written for it
- Only the changed route driven, adjacents skipped because they "weren't touched"
- A finding reported without the console/network capture that proves it happened

## Rationalizations

| Excuse | Reality |
|---|---|
| "The unit tests cover this" | Unit tests cover the units. The bug lives in the wiring, the route, the real click. |
| "I can tell it works from the code" | The code is the intention. The drive is the behavior. QA exists for the gap. |
| "Empty DB is fine, I'm testing the UI" | The UI over no data *is* the empty state. Every list, join, and pagination path went untested. |
| "Writing a spec for this bug doubles the work" | The spec is the only part that outlives the session. The manual find was the expensive half. |
| "That flow is adjacent, not mine" | It shares your code path. Adjacent is exactly where regressions hide. |
| "The console warning is probably pre-existing" | Probably is not a channel. Check the base branch; then it's either your finding or theirs. |

## Project Specifics

Read `.claude/attest/project.md` for the environment boot procedure, seed commands, fixed ports, critical flows, and the e2e framework per surface. If it is missing, run `/i-setup` — do not guess.
