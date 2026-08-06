---
name: i-plan
description: Use when work needs a plan before code — a mini-plan for anything that fits one session, or a decision-ticket map on the tracker for work too big for one. Every task independently rejectable, every unknown named.
---

# I Plan

**Core principle:** A plan is sized by what a reviewer can reject and honest about what it cannot yet see. A plan that hides its unknowns isn't optimistic — it's unfinished and lying about it.

## The Iron Law

```
EVERY TASK INDEPENDENTLY REJECTABLE. EVERY UNKNOWN NAMED. NO PLACEHOLDERS.
```

Placeholders are plan failures, not plan style: "TBD", "add appropriate error handling", "handle edge cases", "similar to task 3" (repeat it — the reader may not have task 3), and any step that says *what* without *how*.

## The Pass

1. **Pick the mode by size.** Fits one working session → **mini-plan**. Spans sessions, or the route to done isn't visible yet → **map**. When unsure, start with the mini-plan; the moment it needs a "phase 2" heading, it was a map.
2. **Mini-plan: five lines, on the issue.** Goal (one sentence) · files touched · seams under test (feeds `/i-code` step 1) · what evidence will prove it done (feeds `/i-attest`) · the main risk. Five honest lines beat five speculative sections.
3. **Map: name the destination first.** One or two lines on what reaching the end looks like — a spec, a locked decision, a completed change. The destination fixes the scope; every ticket exists to clear the route to it.
4. **Chart decision tickets, wire the frontier.** Child issues whose resolution is a *decision*, not build-slices to execute. Use the tracker's native blocking relations so the frontier — open, unblocked, unclaimed — is visible in its UI. Claim a ticket by assigning it *before* working it, so parallel sessions skip it. Resolve **one ticket per session** (pure research excepted): record the answer on the ticket, close it, add one gist line to the map's decision index — the map links to detail, it never restates it.
5. **Keep a fog section.** Questions you can tell are coming but cannot yet phrase sharply live under "Not yet specified" — the test for ticket-vs-fog is whether you can *state* the question precisely now, not whether you can answer it. Resolving tickets graduates fog into new tickets. Ruled-out work goes to "Out of scope" and never graduates; scope changes are a new decision, not scope creep with a heading.
6. **Right-size the tasks.** Split only where a reviewer could reject one task while approving its neighbor — that boundary, not file count or line count, is what makes a task a unit. Fold setup and scaffolding into the task whose deliverable needs them. Then self-review the plan cold: every requirement maps to a task, no placeholder survived, names and signatures agree across tasks.

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

- A "TBD" or "handle errors appropriately" surviving into the saved plan
- Task boundaries that mirror the file tree instead of rejectable units
- A map whose body restates ticket contents instead of linking them
- Three tickets resolved in one sitting — depth per decision is the budget being spent
- Fog pre-sliced into ticket-sized pieces before the frontier reaches it
- A giant issue growing week-by-week checkboxes — that's a map compressed into one ticket, and it will read as one undifferentiated wall

## Rationalizations

| Excuse | Reality |
|---|---|
| "The plan is in my head, writing it is overhead" | Your head doesn't survive session end. The five lines do. |
| "More detail makes the plan better" | Detail about the known, yes. Invented detail about the unknown is fog wearing a spec's clothes — name it as fog. |
| "I'll split the work as I go" | As-you-go splits follow the code you happened to write. Reviewer-rejectable splits have to precede it. |
| "One big issue keeps everything together" | Together and unnavigable. The map keeps it together; the tickets keep it decidable. |
| "This ticket's answer is obvious, I'll do three more" | One decision per session is what keeps each answer considered. Obvious answers to big questions are the expensive kind. |
| "Out of scope for now = later section" | Out of scope means a redrawn destination decides it. "Later" inside the plan is scope creep on a timer. |

## Project Specifics

Read `.claude/attest/project.md` for the tracker, how issues and blocking relations are created, and where plans are recorded. If it is missing, run `/i-setup` — do not guess.
