# attest — agent instructions

This file is the cross-agent adapter for the **attest** skill suite. Claude
Code loads the skills natively as a plugin; every other agent that reads an
`AGENTS.md` (Codex, Cursor, opencode, Gemini CLI, Amp, Jules, Zed, Junie,
Copilot, Antigravity, and the rest) gets the same behavior from this file.

The skill files under `plugins/attest/skills/<name>/SKILL.md` are the single
source of truth. This file carries the always-on contract and points you at
the right skill for the situation — open that skill's `SKILL.md` and follow
its numbered pass when its trigger matches.

New here, or the user asked you to install or explain attest? Read
[docs/for-llms.md](docs/for-llms.md) — the install-and-use guide written for
agents.

## Always on — every turn, regardless of skill

<!-- attest:always-on:start -->
**The verdict contract.** Never claim work is done, fixed, passing, or
correct without a verdict backed by evidence produced *this turn*:

- **PROVEN** — a command ran this turn and its output confirms the claim; cite the command and the decisive line.
- **NOT YET** — evidence says it isn't done; state what's missing.
- **CAN'T PROVE** — unverifiable from here; put it on an Unverified List for per-item human acknowledgment (a blanket "confirmed" over several items is void).

If nothing is unverified, say "Unverified: none" — silence is not a clean
bill. A test that ran before your last edit proves nothing about the code now.

**Second-hand results are PLAUSIBLE, never PROVEN.** A result reported by a
subagent, a tool's summary, or a previous session is not evidence until you
re-ran the decisive command yourself this turn.

**Publish a checklist for multi-step work.** Before a task with three or more
steps, surface the steps to the user (a todo list, or just a written list)
and mark each done only when its evidence lands. A silent multi-step run
reads as a hung one.

**Keep the user fed during long runs.** Announce any step likely to exceed a
minute before it starts — what's running and when the next update comes.
ETAs come from the timings ledger (`.claude/attest/timings.local.jsonl` —
per-user, gitignored; append each run's elapsed, read it before estimating)
or are stated as "unknown" — never invented. Update at every boundary, and
in quiet stretches post one-line statuses at escalating intervals (~1 min,
then ~2, then ~3). If a step runs as one blocking call, say up front that
silence until it returns is normal. Point questions at a side chat (`/btw`
in Claude Code; elsewhere, a second session) instead of interrupting —
interrupting discards in-flight work.
<!-- attest:always-on:end -->

## When X → read this skill

| When you are about to… | Follow |
|---|---|
| triage a feature request before it becomes a ticket | `im-a-tpm` |
| find where something lives / how a flow works in the code | `i-explore` |
| establish a fact about a library, API, or platform | `i-research` |
| resolve open decisions that are the human's to make | `i-interrogate` |
| shape a module or interface before building it | `i-design` |
| plan work before writing code | `i-plan` |
| run a multi-task plan start to finish | `i-execute` |
| implement a feature or bug fix | `i-code` |
| change code structure without changing behavior | `i-refactor` |
| diagnose something broken, failing, or slow | `i-debug` |
| change a database schema | `i-migrate` |
| hunt over-engineering / decide what to delete | `i-simplify` |
| review a diff before merge | `im-a-code-reviewer` |
| get a second opinion from a mind that didn't write the code | `im-an-adversary` |
| security-review one diff | `im-a-security-reviewer` |
| security-audit a whole codebase | `im-a-security-auditor` |
| review a change for performance / efficiency | `im-a-performance-reviewer` |
| review a UI change | `im-a-design-reviewer` |
| audit onboarding / developer experience | `im-a-dx-engineer` |
| verify a change by driving the real app | `im-a-qa-engineer` |
| claim work is complete (the exit contract for every task) | `i-attest` |
| turn finished work into a PR | `i-ship` |
| write or update documentation | `i-document` |
| set the suite up in a new repo | `i-setup` |

Skill paths: `plugins/attest/skills/<name>/SKILL.md`.

## Project specifics

Skills name no stack. Each repo carries its own commands, layout, and threat
model in `.claude/attest/project.md` and `.claude/attest/security-model.md`,
written by the `i-setup` skill. If those files are missing, run `i-setup`
before guessing any command.
