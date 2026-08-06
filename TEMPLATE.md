# attest — Skill Template

Every skill in the family is built from this skeleton. Uniform shape is the
point: a suite that reads differently per skill is a suite nobody
internalizes.

## Naming

- `i-<verb>` — performs an action (`/i-code`, `/i-debug`, `/i-plan`)
- `im-a-<role>` — adopts a reviewer stance (`/im-a-code-reviewer`,
  `/im-a-security-reviewer`)

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
 An item you can satisfy by thinking about it is not an item.>

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
   it changes everywhere in the same commit.
4. **No stack names in skill bodies.** Commands, frameworks, and paths come
   from the project adapter (`.claude/attest/project.md`). If a skill needs
   a fact the adapter lacks, add a slot to the template, don't inline it.
5. **Second-hand results are PLAUSIBLE, not PROVEN.** Any skill that
   dispatches subagents restates this rule where the dispatch happens.
6. **Rationalization tables are behavioral code.** Write the excuses an
   agent actually generates, in first person, and refute each with the
   mechanism, not a slogan.

## Family Map

| Phase | Skills |
|---|---|
| Intake | `im-a-tpm` |
| Understand | `i-explore` (inside the repo) · `i-research` (outside it) |
| Decide | `i-interrogate` · `i-design` · `i-plan` |
| Build | `i-code` · `i-refactor` · `i-debug` · `i-migrate` |
| Review | `im-a-code-reviewer` · `im-a-security-reviewer` · `im-a-security-auditor` · `im-a-design-reviewer` · `im-a-dx-engineer` · `im-an-adversary` · `i-simplify` |
| Verify | `im-a-qa-engineer` · `i-attest` (the exit contract) |
| Ship | `i-ship` · `i-document` |
| Setup | `i-setup` |
