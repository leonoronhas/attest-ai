# attest — guide for AI agents

You are an AI coding agent and your user pointed you at this repository (or
asked you to "install attest", "set up attest", "use attest"). This file
tells you exactly what to do. Read it fully before acting; follow the section
for the host you are running in.

## What attest is

A suite of ~23 first-person skills (`/i-code`, `/im-a-code-reviewer`,
`/i-attest`, …) that make every completion claim carry a verdict backed by
evidence produced this turn. Each skill is a `SKILL.md` under
`plugins/attest/skills/<name>/` — plain markdown you can read and follow.
That directory is the single source of truth; everything else is an adapter.

## Installing

Pick the block for your host. Commands are for the user to run in their
terminal — present them; do not attempt to run them yourself unless the user
asks. If you cannot tell which host you are, use the "Any other agent" block.

**Claude Code** (native plugin):

```bash
claude plugin marketplace add leonoronhas/attest-ai
claude plugin install attest@attest-ai
```

**Codex** (plugin):

```bash
# from a clone of this repo, or point Codex at .codex-plugin/plugin.json
```

The manifest at `.codex-plugin/plugin.json` registers the skills under
`plugins/attest/skills/`.

**Cursor**: the file `.cursor/rules/attest.mdc` is an always-on project rule.
It applies automatically once this repo (or a copy of that file) is in the
workspace — no command needed.

**Any other agent** (Codex, opencode, Gemini CLI, Amp, Jules, Zed, Junie,
Copilot, Antigravity, or a generic agent): read `AGENTS.md` at the repo root.
It carries the always-on contract and a "when X → read this skill" dispatch
table. Nothing to install — treat `AGENTS.md` as your instruction file and
open the referenced `SKILL.md` when a trigger matches.

## Setting up a repo (do this once per project)

Skills name no stack — they read the project's commands, layout, and threat
model from an adapter. Run the setup skill first:

```
/i-setup
```

It interviews the repo and writes `.claude/attest/project.md` (build/test/lint
commands, guards, layout) and `.claude/attest/security-model.md` (sensitive
surfaces). If those files are absent, any skill that needs a command will send
you to run `/i-setup` rather than guess. Do not guess commands — run setup.

## Using the skills

- Skills are **triggered by situation**, not invoked ceremonially. Before you
  claim work is done, run `i-attest`. Before you write code, `i-code`. Before
  you touch a schema, `i-migrate`. The full map is the dispatch table in
  `AGENTS.md`.
- To run a skill, **open its `SKILL.md` and follow the numbered pass in
  order.** Each pass produces evidence; do not skip a step you could satisfy
  by thinking instead of doing.
- Every skill ends in the same verdict block. Honor it.

## The contract you must honor — always, every host, every turn

1. **No completion claim without evidence from this turn.** Work is PROVEN (a
   command ran this turn and its output confirms it — cite it), NOT YET
   (evidence says it isn't done — say what's missing), or CAN'T PROVE
   (unverifiable here — list it for the human to acknowledge item by item). If
   nothing is unverified, say "Unverified: none." A run from before your last
   edit is not evidence.
2. **Second-hand results are PLAUSIBLE, never PROVEN.** A subagent's report, a
   tool's summary, or a prior session's claim is not evidence until you re-ran
   the decisive command yourself this turn.
3. **Publish a checklist** for any task of three or more steps and mark each
   step done only when its evidence lands.

## If the user just pasted the link and asked what this is

Summarize the two paragraphs at the top, tell them the install command for
their host, and offer to run `/i-setup` once installed. Don't dump the whole
skill list unless they ask — point them at the README's family walkthrough.
