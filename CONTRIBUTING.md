# Contributing

attest is a suite of prose skills — every change is a documentation change,
and the bar is the one the skills themselves enforce: claims verified,
shape uniform.

## The shape

Every skill follows [TEMPLATE.md](TEMPLATE.md) — trigger-shaped
description, an iron law, an evidence-producing pass, the byte-identical
verdict spine, red flags, and a rationalization table. Read it before
adding or editing a skill.

## Validation

```bash
bash scripts/validate-release.sh
```

The validator is dependency-free shell — no runtime, no toolchain, nothing
to install, portable across macOS (bash 3.2, BSD tools) and Linux (GNU).

CI runs this on every PR and push to main. It enforces the family's
invariants: marketplace → manifest → skills resolution, the verdict spine
byte-identical across every skill, the always-on contract in sync between
`AGENTS.md` and the Cursor rule, dispatch tables matching the skill
directories, required template sections per skill, the progress-protocol
spine, and equal versions across the two plugin manifests.

Adding a skill is red→green: create
`plugins/attest/skills/<name>/SKILL.md` and the validator fails until the
skill is registered in all four dispatch surfaces — `AGENTS.md`,
`.cursor/rules/attest.mdc`, the README family table, and TEMPLATE.md's
family map.

## Versioning

Versions live in the two plugin manifests (the validator keeps them equal)
and follow one test — **would an agent following the suite yesterday and
today behave identically?**

- **Patch** (0.9.0 → 0.9.1) — yes: wording fixes that change no rule, doc
  corrections, validator and CI internals, manifest metadata.
- **Minor** (0.9.x → 0.10.0) — no, compatibly: a new skill, a new Pass
  step, a new adapter slot, a description change that alters when a skill
  fires.
- **Major** (→ 1.0, then 2.0) — a contract break: verdict-spine semantics,
  a skill renamed or removed, an adapter slot renamed or removed. 1.0 is
  the deliberate promise that those contracts now only break with a major.

## Releasing

Every change ships with its bump — patch, minor, or major per the test
above; there is no long-lived Unreleased section. The commit that changes
the suite also bumps both manifests and records itself in CHANGELOG.md
under the new version's dated section, then:

```bash
git tag vX.Y.Z && git push origin main vX.Y.Z
```

Installed copies pick releases up through `/i-upgrade`.
