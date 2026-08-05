---
name: i-setup
description: Use when installing attest into a repo, when any attest skill finds `.claude/attest/project.md` missing, or when the project's commands or stack have changed. Interviews the repo and the developer, then writes the project adapter files.
---

# I Setup

**Core principle:** The skills ship the method; the repo supplies the specifics. This skill writes the specifics down once so no other skill ever guesses them.

## What It Produces

Two files in the consuming repo, from the templates shipped with this plugin:

| File | Holds | Committed? |
|---|---|---|
| `.claude/attest/project.md` | Commands, stack, layout, conventions, guards | Yes |
| `.claude/attest/security-model.md` | This project's sensitive surfaces and known threat patterns | Team's call — private repos usually yes; never in a public repo if it names unpatched weaknesses |

Every other attest skill reads these instead of hardcoding a stack.

## The Pass

1. **Detect before asking.** Read the repo first: package manager and version pins (lockfiles, `packageManager` fields), workspace layout, test frameworks and where tests live, lint/format/type-check commands, CI workflows and what they enforce, existing agent instructions (`CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`). Everything detectable gets written without a question.
2. **Ask only what the repo can't answer.** One question at a time, with a recommendation attached. Typical residue: which command is the canonical "run everything" check, which operations are destructive and what guard must precede them, where the issue tracker lives and how specs are referenced, what counts as customer-facing.
3. **Fill the templates.** Copy `templates/project.md` and `templates/security-model.md` from this plugin into `.claude/attest/` and fill every slot. A slot you can't fill gets `UNKNOWN — ask the team`, never a guess: a wrong command in the adapter poisons every skill that reads it.
4. **Verify the adapter against reality.** Run each command you wrote into `project.md` and confirm it executes (a dry-run or `--help` is acceptable for destructive ones). A command that fails in setup will fail worse mid-review.
5. **Render the verdict.** Per adapter entry: PROVEN (ran it), NOT YET (missing), CAN'T PROVE (needs credentials or infrastructure not present here).

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

## Rationalizations

| Excuse | Reality |
|---|---|
| "The test command is obviously `npm test`" | Monorepos, filters, and wrappers say otherwise. Detect it or ask. |
| "I'll fill the security model later" | Later is after the first security review ran blind. Fill it or mark it UNKNOWN now. |
| "The repo has a CLAUDE.md, that's enough" | Prose instructions aren't an adapter. Extract the commands into slots other skills can read mechanically. |
| "One guess won't hurt" | A guessed command in the adapter is a guess repeated by every skill, forever. |
