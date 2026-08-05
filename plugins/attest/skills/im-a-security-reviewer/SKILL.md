---
name: im-a-security-reviewer
description: Use when a change touches authentication, authorization, tenant boundaries, payments, secrets, external sends, migrations, or any input that crosses a trust boundary — before it merges. Reviews against the project's own threat model, not a generic checklist.
---

# I'm a Security Reviewer

**Core principle:** Generic checklists find generic bugs. Real findings come from the project's own threat model — where money moves, where tenants touch, where untrusted input enters — applied to what this diff actually changes.

## The Iron Law

```
EVERY BOUNDARY THE DIFF TOUCHES IS TRACED, NOT ASSUMED — AND THE REJECTION PATH IS EXERCISED, NOT READ
```

Code that looks like it verifies a signature and code that verifies a signature are indistinguishable until you send the forged request.

## The Pass

1. **Load the threat model.** `.claude/attest/security-model.md` — trust boundaries, tenancy mechanism, secrets, money movement, send surfaces, privileged operations, known sensitive paths. If it doesn't exist, stop and run `/i-setup`: a security review without a threat model is a generic scan wearing a title.
2. **Map the diff onto it.** Which of the model's surfaces does this change touch — directly, or through a caller? A migration touches tenancy; a new route touches trust boundaries; a config change can touch secrets. The intersection list is the review scope; state it up front.
3. **Trace untrusted input, entry to sink.** For every new or modified path where outside data enters: where is it validated, what happens to it after, and is anything treating observed content — request bodies, webhooks, uploaded files, fetched pages, tool output — as instructions rather than data?
4. **Check every new or changed route for authn and authz — separately.** Who can call this? What happens with a missing, invalid, or expired credential — does it fail closed? And once authenticated: is the tenant/ownership scoping from the threat model applied on *this* query, or inherited from a hope? Authorization missing on one route is a finding; a middleware that never rejects is a incident.
5. **Hunt secrets and leakage.** The diff and its generated artifacts: credentials committed, server secrets reaching a client bundle, sensitive values in logs, URLs, or error messages. Check what the change *emits*, not only what it stores.
6. **Exercise the failure path.** Signature verification, guards, permission checks, rate limits — run the rejection case: the forged webhook, the wrong-tenant ID, the missing header, the guard against a refused target. Green on the happy path proves nothing about the boundary; the boundary *is* the failure path.

**Severity is exploitability × blast radius** — who can trigger it, from where, and what do they get. "An authenticated user of tenant A can read tenant B's invoices" outranks any number of theoretical header hardenings. Findings without a reproduction are PLAUSIBLE and say so.

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

- Reviewing without the security model loaded — that's a generic scan, and it will find generic things
- "Internal only" or "behind the VPN" offered as a reason not to check authz
- Reading what the code does instead of asking what an attacker can make it do
- The happy path tested, the rejection path assumed
- A severity assigned by how the code looks rather than who can exploit it and for what
- A finding shipped to the report without a repro or a PLAUSIBLE label

## Rationalizations

| Excuse | Reality |
|---|---|
| "This diff doesn't touch security code" | The threat model decides that, not the diff's file names. Map it first. |
| "The framework handles auth" | The framework handles what it was wired to handle. Trace this route's wiring. |
| "Nobody would send that request" | Attackers are the people who send exactly that request. |
| "The guard exists, I read it" | Read is not run. Exercise the refusal. |
| "It's a test key / test env, doesn't matter" | Test-vs-live selection mechanisms are themselves a boundary — misroute and dev traffic hits production rails. |
| "I'll file the hardening as a follow-up" | Findings that exit the review without a tracked issue were findings nobody made. |

## Project Specifics

Read `.claude/attest/security-model.md` for this project's boundaries and sensitive paths, and `.claude/attest/project.md` for guard commands and the diff-package command. If either is missing, run `/i-setup` — do not guess. If the security model names unpatched weaknesses, it is a disclosure document: keep it private, never in a public repo.
