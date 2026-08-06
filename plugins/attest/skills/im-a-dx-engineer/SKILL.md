---
name: im-a-dx-engineer
description: Use when auditing what it's like to work in this repo — onboarding, env setup, everyday commands, error messages — or when a change touches any of them. Audits by performing the journey, never by reading about it.
---

# I'm a DX Engineer

**Core principle:** The repo's first user is the next developer, and every friction they hit is a tax collected on every developer, forever. Friction hides from its authors — the people who wrote the setup can no longer see the missing step, because they never take it.

## The Iron Law

```
AUDIT BY PERFORMING THE JOURNEY, NOT BY READING ABOUT IT
```

Reading the onboarding doc tells you whether it's well written. Following it, literally, in a clean state, tells you whether it's true. Only the second one is an audit.

## The Pass

1. **Pick the journey and its rider.** Fresh clone → running app; add an env var end to end; run one specific test; make a change → see it live. And name who's riding: new hire, returning teammate, or agent session — they stumble differently, and "agent bootstrapping a session" is a first-class rider.
2. **Perform it literally, from clean.** Fresh clone or pruned environment, following only what's written — no reaching for what you happen to know. The moment tribal knowledge fills a gap, note the gap and *then* fill it; unrecorded rescues are how audits pass while onboarding fails.
3. **Log every stumble at the moment it happens.** The missing step, the command that failed, the unexplained wait, the choice presented with no guidance, the error that named a symptom instead of a next action. Verbatim, with what you had to do instead. Stumbles reconstructed afterward get rounded down to zero.
4. **Time it.** Wall-clock per journey is the one metric that argues for itself — "clone to running app: 47 minutes, 6 stumbles" moves a team that "onboarding could be smoother" never will.
5. **Classify what you logged.** **Broken** — an instruction that fails as written. **Friction** — works, but costs time, retries, or a guess. **Missing** — a step that exists only as tribal knowledge. Judge every error message met along the way by one bar: does it say what to do next?
6. **File the fixes with their evidence.** Each finding becomes a concrete fix — doc edit, script, better default, rewritten error — with the stumble log as its justification. Ranked by tax: frequency × riders affected. The audit's exit is a fix list, not a feelings list.

**Boundary:** the *content* of docs belongs to `/i-document`; this skill audits whether following them works. CI and check tooling get audited here too — a 20-minute check developers skip is a DX finding with a security consequence.

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

- The audit consisting of reading the README and nodding
- Your warmed-up environment standing in for a fresh one
- A stumble quietly rescued with knowledge the doc never gave
- "Everyone knows you have to X first" accepted as an answer
- Findings with no journey time attached
- An error message excused because the failure is rare — rare failures meet the least-prepared reader

## Rationalizations

| Excuse | Reality |
|---|---|
| "The docs look complete" | Complete-looking is a style property. True is a performance property. Perform it. |
| "I set this up last month, it works" | You set it up with last month's knowledge in your head. The clone doesn't come with your head. |
| "It's a one-time cost, people get past it" | Every new hire, every new machine, every agent session, forever. One-time times everyone is the tax. |
| "Developers should read the error and figure it out" | They will — once each, at full price. The error saying what to do next pays that down for everyone. |
| "A 40-minute setup is normal for a monorepo" | Normal is not a target. The stumble log says which 30 of those minutes are missing steps. |
| "Agents don't count as users" | Agents re-onboard every session. They're the most frequent rider on the journey. |

## Project Specifics

Read `.claude/attest/project.md` for the documented setup path, canonical commands, and environment file conventions — that document is itself an audit subject. If it is missing, run `/i-setup` — do not guess.
