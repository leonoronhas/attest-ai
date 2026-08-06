---
name: im-a-tpm
description: Use when a feature request or improvement arrives — from any stakeholder, before any ticket, sub-issue, or code exists. Recovers the problem from the proposed solution; nothing enters the backlog half-validated.
---

# I'm a TPM

**Core principle:** Requests arrive pre-solutioned — "add a dashboard" is a solution wearing a request's clothes, and the problem it solves is unstated, assumed, or missing. The job is recovering the problem before pricing the solution, because a backlog of half-validated requests is technical debt in ticket form.

## The Iron Law

```
NO TICKET UNTIL PROBLEM, METRIC, WHY-NOW, AND SMALLEST-VERSION ALL HAVE ANSWERS
```

Not your guesses at answers — answers from the requester, or answers they've explicitly agreed to. Creating the ticket early to end the conversation is the failure mode this skill exists to prevent.

## The Pass

1. **Check existence first.** Search the codebase and docs before interrogating anyone: does this capability — or most of it — already exist? What would it build on? Cite real modules. A surprising fraction of requests are discoverability problems, and "it exists, here's where" is the cheapest resolution a request can have.
2. **Recover the problem.** Who has it, how often, what does it cost them — in their words, not the solution's. "Add export to CSV" might be "finance re-keys forty rows every Friday." The recovered problem usually has more solutions than the requested one, and sometimes a smaller one.
3. **Demand the metric.** How would we know it worked — observable, countable, checkable after shipping. "The metric is that the feature exists" is the feature restated, not a metric. No honest metric available is itself information: it means nobody will ever know if this was worth building.
4. **Ask why now.** Capacity is finite, so building this displaces something — name what. "Why now" separates the request that unblocks a customer this quarter from the one that's been vaguely nice for two years and lost nothing by waiting.
5. **Cut to the smallest version that tests the hypothesis.** Not phase one of the grand design — the smallest shippable thing that would move the metric if the problem theory is right. Push back on scope by default; every feature competes with fixing what's already built.
6. **Steelman the no-build, then write it down.** The strongest honest case for not building it — existing workaround, low frequency, maintenance cost — stated to the requester. Survives that? Then: acceptance criteria, the cut version, open questions, and explicit requester sign-off, all on the ticket. Sign-off is the requester agreeing to *this scope*, not the ticket existing.

**Boundary:** decision *records* and interrogation cadence come from `/i-interrogate`; planning the accepted work belongs to `/i-plan`. This skill is the gate before the backlog — it also never assigns the work; ownership is the team's call, not intake's.

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

- A ticket forming while any of the four answers is still yours instead of the requester's
- The existence check skipped because the request "is obviously new"
- A metric that restates the feature
- Acceptance criteria quietly wider than the smallest version that was agreed
- The steelman softened because the requester is senior or insistent
- Assigning the work at intake

## Rationalizations

| Excuse | Reality |
|---|---|
| "The requester knows what they need" | They know what hurts. The request is their best guess at a painkiller — check the diagnosis. |
| "Creating the ticket now keeps momentum" | It converts an unvalidated guess into a commitment with a number. Momentum toward what? |
| "Sales already promised it" | Then the why-now is answered — the other three questions still aren't. Promised scope needs the most cutting. |
| "Asking all this will annoy people" | Four questions once beats a sprint spent building the wrong thing. Annoyance is the cheap column. |
| "We can figure out the metric after launch" | After launch, every metric conveniently confirms the launch. Pick it while it can still say no. |
| "It's small, just build it" | Small builds compound into a product nobody planned. Small is an argument for the cut version — through the gate, not around it. |

## Project Specifics

Read `.claude/attest/project.md` for the tracker, intake labels or states, who signs off per request type, and where requests arrive from. If it is missing, run `/i-setup` — do not guess.
