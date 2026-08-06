---
name: i-design
description: Use when shaping a module, interface, or API before building it — where a seam goes, what callers see, what stays hidden. Two designs minimum, judged at the interface, decided on record.
---

# I Design

**Core principle:** Design is deciding what callers never have to know. A deep module hides substantial machinery behind a simple interface; a shallow one makes every caller carry what it failed to decide.

## The Iron Law

```
TWO GENUINELY DIFFERENT DESIGNS, JUDGED AT THE INTERFACE, ONE DECISION ON RECORD
```

The first design that comes to mind is the one shaped like the current code. It might win — but untested against an alternative, it didn't win, it just went unopposed.

## The Pass

1. **State the problem from the caller's side.** What do callers need to accomplish — not how the module will do it. If you can't write this sentence without naming implementation details, the problem statement is already leaking.
2. **Write the call site first.** Draft the actual code a caller would write, before the module exists. The call site is the interface's spec: if it's awkward here, no implementation will fix it. Include the error path — how does a caller find out it failed, and what can they do about it?
3. **Design it twice.** A second design with a genuinely different decomposition — different responsibilities, different boundary, different state ownership. Not the first design with renamed methods. If a credible second shape won't come, that's evidence you don't understand the problem yet, not evidence the first shape is right.
4. **Judge both at the interface.** Per design: how much must a caller know (less is deeper)? What implementation facts leak through the signature? Where does the test seam fall, and can the machinery be exercised without scaffolding half the system? The **deletion test**: could you gut and replace the implementation without touching a single caller? A design that fails it has its interface welded to its internals.
5. **Name the deliberate leaks.** Most real interfaces expose something impure — a performance knob, a batching hint, a transaction handle. Each leak gets named with its reason. An unnamed leak is an accident; a named one is a decision.
6. **Record the decision — with the loser.** The chosen design, the rejected one, and why, wherever the adapter says decisions live. The rejected design is the valuable half: it's what stops the same debate from re-running in six months with less context.

**Boundary:** decisions that belong to a human — taste calls, scope trades — route through `/i-interrogate`. Building the winner is `/i-code`'s job; reshaping existing code toward it is `/i-refactor`'s.

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

- One design presented as "the obvious approach" with no opponent
- An interface whose methods mirror the implementation's internal steps
- A configuration option added to avoid making a decision — that's the decision, exported to every caller
- The error path designed last, or not at all
- A wrapper layer that only delegates — depth zero, surface area doubled
- The rejected design discarded instead of recorded

## Rationalizations

| Excuse | Reality |
|---|---|
| "There's really only one way to do this" | There's one way shaped like the existing code. The second design is how you find out which. |
| "Designing twice takes twice as long" | It takes one draft interface longer, and it's the cheapest point in the lifecycle to be wrong. |
| "We can make it flexible and decide later" | Flexibility is every caller paying for your undecided question. Decide. |
| "The call site will be fine once the module works" | Backwards. The call site is the requirement; the module serves it. |
| "It leaks a little, but users will understand" | Then name the leak and its reason. Understood leaks are contracts; unnamed ones are traps. |
| "We'll remember why we chose this" | The team that remembers is not the team that maintains it. Record the loser. |

## Project Specifics

Read `.claude/attest/project.md` for where design decisions are recorded and the layering conventions new modules must fit. If it is missing, run `/i-setup` — do not guess.
