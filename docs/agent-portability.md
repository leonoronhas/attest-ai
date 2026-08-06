# Agent Portability

attest is an agent-portable skill suite. The files under
`plugins/attest/skills/<name>/SKILL.md` hold the behavior; everything else is
a thin adapter that makes those skills loadable in a given agent. The adapters
never restate a skill — they point at it.

## Source of truth

- **Skills:** `plugins/attest/skills/*/SKILL.md` — one source of truth, read
  directly by any agent.
- **Always-on contract:** the verdict rule (PROVEN / NOT YET / CAN'T PROVE),
  the second-hand-is-PLAUSIBLE rule, and the publish-a-checklist rule. These
  bind every turn regardless of which skill is active, so every adapter
  carries them.

## Supported adapters

| Host | Files | Tier |
|---|---|---|
| Claude Code / Claude apps | `.claude-plugin/`, `plugins/attest/` | Full plugin — `claude plugin install attest@attest-ai` |
| Codex | `.codex-plugin/plugin.json` → `plugins/attest/skills/` | Plugin — skills installed as a Codex plugin |
| Cursor | `.cursor/rules/attest.mdc` | Always-on project rule + dispatch table |
| Codex/Gemini/opencode/Amp/Jules/Zed/Junie/Copilot/Antigravity/generic | `AGENTS.md` (repo root) | Instruction-tier — always-on contract + dispatch table |

Every agent that reads an `AGENTS.md` at the repo root gets the contract and a
"when X → read this skill" table with zero setup. Hosts with a richer format
(Claude, Codex, Cursor) get a dedicated adapter above that instruction tier.

## Adapter rule

Keep adapters thin. A host that supports skills gets pointed at
`plugins/attest/skills/`. A host that only supports project instructions gets
a rule file whose contract text stays aligned with `AGENTS.md` — when the
always-on contract changes, `AGENTS.md` and `.cursor/rules/attest.mdc` change
together, and the skills stay untouched.

## Adding a host

1. If it reads `AGENTS.md`, it already works — nothing to add.
2. If it has a skills/plugin format, add a manifest pointing at
   `plugins/attest/skills/`.
3. If it only takes a rule file, copy the always-on contract and the dispatch
   table from `AGENTS.md` into the host's path, and note it here.
