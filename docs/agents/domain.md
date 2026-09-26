# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase. Layout: **single-context** — the whole app is one business domain (life-insurance advisory for RE teams).

## Before exploring, read these

- **`CONTEXT.md`** at the repo root (domain glossary), if it exists.
- **`docs/decisions/`**: this repo's ADRs (not `docs/adr/`). Read the index in `docs/decisions/README.md`, then the ADRs that touch the area you're about to work in.
- **`docs/PROJECT-PLAN.md`** §1–§2.3 and §4.5 for product requirements, metric definitions and the AI copilot design.

If `CONTEXT.md` doesn't exist, **proceed silently**. Don't flag its absence; don't suggest creating it upfront. Create it lazily when terms actually get resolved.

## File structure

```
/
├── CONTEXT.md              ← domain glossary (created when needed)
├── docs/decisions/         ← ADRs: NNNN-slug.md, indexed in README.md
├── apps/desktop/
└── packages/{domain,db,ai,ui}/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md` and the ADRs — e.g. RE, TL, N4–N1, KYC note / KYC fact, submitted / issued, FYP, case size, chuyển RF. Don't drift to synonyms (e.g. "RM" means RE — Q16).

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (add it to `CONTEXT.md`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (metric definitions), but worth reopening because…_

Changing an accepted ADR needs Owner approval (G1).
