# attest — Skill Template

Every skill in the family is built from this skeleton. Uniform shape is the
point: a suite that reads differently per skill is a suite nobody
internalizes.

## Naming

- `i-<verb>` — performs an action (`/i-code`, `/i-debug`, `/i-plan`)
- `im-a(n)-<role>` — adopts a reviewer stance (`/im-a-code-reviewer`,
  `/im-an-adversary`)

## Skeleton

```markdown
---
name: i-<verb> | im-a-<role>
description: Use when <trigger condition>, before <the thing this gates>.
---

# <Title>

**Core principle:** <one line>

## The Iron Law

```
<THE SINGLE NON-NEGOTIABLE, IN CAPS, IN A FENCED BLOCK>
```

## The Pass

<N numbered items. Each item is an ACTION that produces output.
 An item you can satisfy by thinking about it is not an item.
 The Pass IS the checklist — see rule 7: publish it live and mark it.>

## Verdict

<!-- SPINE: copied byte-identical from skills/i-attest/SKILL.md.
     Never paraphrased per-skill. -->

## Red Flags — Stop

<bullet list of tells that the skill is about to be skipped>

## Rationalizations

| Excuse | Reality |
|---|---|

## Project Specifics

Read `.claude/attest/project.md` for this project's commands and
conventions. If it is missing, run /i-setup — do not guess.
```

## Rules

1. **Descriptions are trigger-shaped, not titles.** "Use when about to
   claim work is complete, before committing" — not "Verification skill."
   The description is what makes the skill fire at the right moment
   without an orchestrator.
2. **Every Pass item produces evidence.** Output, a diff, a file, a table —
   something that exists after the item ran.
3. **The Verdict section is byte-identical across the family.** Source of
   truth is `plugins/attest/skills/i-attest/SKILL.md`. When it changes,
   it changes everywhere in the same commit — `scripts/validate-release.sh`
   fails the build when any copy drifts. One template exemption exists:
   `i-setup` carries no Project Specifics section, because it is the skill
   that writes that file.
4. **No stack names in skill bodies.** Commands, frameworks, and paths come
   from the project adapter (`.claude/attest/project.md`). If a skill needs
   a fact the adapter lacks, add a slot to the template, don't inline it.
5. **Second-hand results are PLAUSIBLE, not PROVEN.** Any skill that
   dispatches subagents restates this rule where the dispatch happens.
6. **Rationalization tables are behavioral code.** Write the excuses an
   agent actually generates, in first person, and refute each with the
   mechanism, not a slogan.
7. **Publish the Pass as a live checklist.** Before running a multi-step
   Pass, surface its steps to the user through the harness's todo/checklist
   tool (`TodoWrite`, a task list, or the equivalent — tool-agnostic, like
   the rest of the suite) and mark each step done only when its evidence
   lands. The Pass a skill already defines *is* the checklist; this rule is
   about making the run visible and mutually legible, not inventing a
   second list. A silent multi-step run reads as a hung one, and the
   checkmarks are where the verdict table's evidence accretes step by step.
   Trivial single-step skills need no checklist; anything with three or
   more Pass items gets one.
8. **Keep the user fed during long runs.** Announce any step likely to
   exceed a minute *before* it starts — what's running and when the next
   update comes (a range from a real basis, or "unknown duration"; never an
   invented ETA — a blown fake ETA teaches people to interrupt). Update at
   every boundary (subagent return, fix round, checkmark), and in quiet
   stretches post one-line statuses at escalating intervals — after ~1
   minute, then ~2, then ~3 — whenever you have the floor. Be honest about
   mute stretches: nothing can be emitted while a blocking call is in
   flight, so a step that runs blind gets announced as such up front
   ("silence until this returns is normal"); prefer background dispatch for
   steps past ~2 minutes where the harness supports it. Point questions at
   a side chat (`/btw` in Claude Code; elsewhere, a second session) instead
   of the interrupt key, and state the interrupt cost once: in-flight work
   discarded, the step restarts. On completion, report actual elapsed and
   append it to the timings ledger — `.claude/attest/timings.local.jsonl`,
   one JSON line per run: `{"skill", "step", "date", "elapsed_s", "scope"}`.
   ETAs are read from that ledger (this user's real prior runs, as ranges)
   or stated as "unknown" — never invented. The ledger is per-user and
   gitignored; `/i-setup` creates it and the ignore entry. The in-skill
   paragraph that opens a long-running Pass ("Publish these steps as a live
   checklist…") is a second spine: byte-identical wherever it appears,
   enforced by the validator like the verdict block.

## Family Map

| Phase | Skills |
|---|---|
| Intake | `im-a-tpm` |
| Understand | `i-explore` (inside the repo) · `i-research` (outside it) |
| Decide | `i-interrogate` · `i-design` · `i-plan` |
| Build | `i-code` · `i-refactor` · `i-debug` · `i-migrate` · `i-execute` (orchestrates a plan) |
| Review | `im-a-code-reviewer` · `im-a-security-reviewer` · `im-a-security-auditor` · `im-a-performance-reviewer` · `im-a-design-reviewer` · `im-a-dx-engineer` · `im-an-adversary` · `i-simplify` |
| Verify | `im-a-qa-engineer` · `i-attest` (the exit contract) |
| Ship | `i-ship` · `i-document` |
| Setup | `i-setup` · `i-upgrade` |
