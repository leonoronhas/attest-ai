---
name: i-setup
description: Use when installing attest into a repo, when any attest skill finds `.claude/attest/project.md` missing, or when the project's commands or stack have changed. Interviews the repo and the developer, then writes the project adapter files.
---

# I Setup

**Core principle:** The skills ship the method; the repo supplies the specifics. This skill writes the specifics down once so no other skill ever guesses them.

## The Iron Law

```
EVERY ADAPTER ENTRY WAS DETECTED OR ASKED — NEVER GUESSED. EVERY COMMAND WRITTEN WAS RUN.
```

A wrong entry in the adapter is not one mistake — it is every future skill's mistake, replayed on every run until someone traces it back here.

## What It Produces

Two files in the consuming repo, from the templates shipped with this plugin:

| File | Holds | Committed? |
|---|---|---|
| `.claude/attest/project.md` | Commands, stack, layout, conventions, guards, tracker, Toolbox, version stamp | Yes |
| `.claude/attest/security-model.md` | This project's sensitive surfaces and known threat patterns | Team's call — private repos usually yes; never in a public repo if it names unpatched weaknesses |
| `.claude/attest/timings.local.jsonl` | Per-run skill durations (`{"skill","step","date","elapsed_s","scope"}`) — what grounds every ETA in this user's real runs | **No — per-user.** This skill adds `.claude/attest/*.local.jsonl` to `.gitignore` |

Every other attest skill reads these instead of hardcoding a stack. When the
suite adds new adapter slots (a new skill usually brings some), re-run this
skill to fill them — an adapter missing a slot sends every skill that needs
it back here.

## The Pass

1. **Detect before asking.** Read the repo first: package manager and version pins (lockfiles, `packageManager` fields), workspace layout, test frameworks and where tests live, lint/format/type-check commands, CI workflows and what they enforce, existing agent instructions (`CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`). Then probe the session, not just the repo: the issue tracker in use (tracker MCP tools, config files, remotes), the Toolbox (which MCP servers and CLIs this session can actually reach — probe them, don't assume), and the installed attest version for the stamp. Everything detectable gets written without a question.
2. **Ask only what the repo can't answer.** One question at a time, with a recommendation attached. Typical residue: which command is the canonical "run everything" check, which operations are destructive and what guard must precede them, where the issue tracker lives and how specs are referenced, what counts as customer-facing.
3. **Fill the templates.** Copy `templates/project.md` and `templates/security-model.md` from this plugin into `.claude/attest/` and fill every slot. A slot you can't fill gets `UNKNOWN — ask the team`, never a guess: a wrong command in the adapter poisons every skill that reads it.
4. **Create the timings ledger and gitignore it.** Touch `.claude/attest/timings.local.jsonl` and add `.claude/attest/*.local.jsonl` to the repo's `.gitignore` if absent. Every skill appends its run's elapsed there and reads it before announcing an ETA — per-user data, never committed, never shared: one dev's machine says nothing about another's.
5. **Verify the adapter against reality.** Run each command you wrote into `project.md` and confirm it executes (a dry-run or `--help` is acceptable for destructive ones). A command that fails in setup will fail worse mid-review.
6. **Render the verdict.** Per adapter entry: PROVEN (ran it), NOT YET (missing), CAN'T PROVE (needs credentials or infrastructure not present here).

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

- A command written into the adapter that was never executed this turn
- A slot filled from what you remember about this stack instead of what this repo says
- "UNKNOWN — ask the team" avoided because it feels like failure — the marked unknown is the honest entry
- The security model stubbed "for now" with no UNKNOWN markers to find later
- A CLAUDE.md instruction copied in as a command without running it
- The timings-ledger gitignore entry skipped — the next commit publishes one developer's machine timings as everyone's

## Rationalizations

| Excuse | Reality |
|---|---|
| "The test command is obviously `npm test`" | Monorepos, filters, and wrappers say otherwise. Detect it or ask. |
| "I'll fill the security model later" | Later is after the first security review ran blind. Fill it or mark it UNKNOWN now. |
| "The repo has a CLAUDE.md, that's enough" | Prose instructions aren't an adapter. Extract the commands into slots other skills can read mechanically. |
| "One guess won't hurt" | A guessed command in the adapter is a guess repeated by every skill, forever. |
