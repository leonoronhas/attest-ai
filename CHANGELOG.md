# Changelog

Notable changes to the attest skill suite. Versions are the plugin
manifests' (`plugins/attest/.claude-plugin/plugin.json` and
`.codex-plugin/plugin.json` — the validator keeps them equal). The suite
stays 0.x while the skill surface is still moving. Patch = no behavior
change; minor = new skills or compatible behavior change; major = contract
breaks — the full policy is in README § Development.

## [0.10.0] — 2026-08-06

### Added

- i-upgrade — checks installed vs marketplace version, reads the changelog
  delta, runs the host's upgrade path, proves the new version from the
  re-read manifest, then chains i-setup for new adapter slots
- project.md template: attest version stamp, issue-tracker draft slots
  (create tool + draft convention), and a Toolbox section (detected MCP
  servers and CLIs with a detected-on stamp)
- i-setup detects the tracker, the Toolbox, and the installed version
  during its detect pass
- Versioning policy (patch/minor/major + release ritual) in README

- `scripts/validate-release.mjs` — release validator: marketplace → manifest
  → skills resolution, verdict-spine identity across every skill, always-on
  contract sync (AGENTS.md ↔ Cursor rule), skill frontmatter sanity (PR #1)
- GitHub Actions workflow running the validator on every PR and push to
  main (PR #1)
- Validator coverage extended: dispatch-table ↔ skill-directory sync across
  AGENTS.md, the Cursor rule, README, and TEMPLATE; required template
  sections per skill; progress-protocol spine identity; plugin-manifest
  version equality; unknown-skill reference check across docs/
- i-setup: Iron Law and Red Flags sections (template conformance)
- This changelog

### Changed

- Always-on contract slimmed: the long-run rule is now a three-line kernel
  (announce steps over a minute, never invent an ETA) pointing at the full
  progress protocol every long-running skill carries in its Pass
- Codex manifest moved into the plugin root
  (`plugins/attest/.codex-plugin/`) with plugin-relative skill paths (PR #1)
- im-a-security-auditor prepares tracked-issue drafts and creates them only
  with explicit tracker-write authorization (PR #1)
- im-a-security-auditor's description no longer claims single-diff scope —
  the pre-merge diff belongs to im-a-security-reviewer
- Verdict-spine check parses section boundaries instead of embedding spine
  text in the validator, so a spine edit stays a skills-only change
- actions/checkout pinned by commit SHA

### Fixed

- Stale "~23" skill count in docs/for-llms.md (the count is 24 and moving;
  the docs no longer state one)
- Codex install block in docs/for-llms.md carries real commands, verified
  against a live install (previously an empty placeholder fence)
- Naming pattern documented as `im-a(n)-<role>`, matching im-an-adversary

## [0.9.0] — 2026-08-06

- im-a-performance-reviewer, with sweep-only mode for small diffs
- i-execute risk gates: security/performance specialists join the
  between-task review when a diff touches their surfaces
- Progress protocol and timings ledger as a family rule

## [0.8.0] — 2026-08-06

- Cross-agent portability: AGENTS.md router, Codex and Cursor adapters
- docs/agent-portability.md and docs/for-llms.md

## [0.7.0] — 2026-08-06

- i-execute plan orchestration; live-checklist family rule

## [0.6.0] — 2026-08-05

- i-prove renamed i-attest; im-a-security-auditor with the vulnerability
  catalog; review and ship waves completing the family

## Pre-0.6.0 — 2026-08-05

- Scaffold and waves 1–3: the verdict spine, i-setup and the adapter
  templates, and the first fourteen skills
