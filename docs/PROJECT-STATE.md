# Project-2C Current State

## Current phase

Phase 1 — foundation (milestone #1, branch `phase-1/foundation`). Started 2026-09-26.

## Canonical repository

`AlexH-AI/Project-2C` (private)

## Canonical accepted branch

`main`

## Local workspace convention

`C:\workspace\Project-2C`

## Cross-machine synchronization

GitHub is the source of truth for Home PC <-> Office laptop continuity.

## Execution model

Claude Code only: Opus 5.5, effort medium, no subagents. Claude works autonomously except at OWNER approval gates G1–G8. See `docs/PROJECT-PLAN.md` §4.1 and §7.2.

## Current OWNER decisions

- 2026-09-26: Project-2C created as the Claude-only control build of Project-2 (decisions C1–C8 in `docs/PROJECT-PLAN.md` §7.2).
- Product requirements = Project-2 decisions Q1–Q16 (inherited unchanged).
- Project-2C is built first; Project-2 (multi-agent) follows after 2C is complete.
- Isolation and comparison rules: `docs/COMPARISON.md`.

- 2026-09-26: Decisions recorded as ADR-0001…0012 in `docs/decisions/`.
- 2026-09-26: G4 approved — Superpowers 6.4.2 (project-scope plugin) + mattpocock/skills subset vendored in `.claude/skills/`; Agent tool denied in `.claude/settings.json` (ADR-0012).

- 2026-09-26: #3 — GitHub Free has no branch protection for private repos; OWNER chose local enforcement (pre-push hook) + Claude merges `risk:low` PRs when CI is green.
- 2026-09-26: G3 approved — UI direction recorded as ADR-0013 (PR #13), score 8/10.
- 2026-09-26: PR #10 merged (#1, #2, #3 closed).
- 2026-09-26: KYC version `material` flag (ADR-0008 §7) — first version always material; later versions material when the current facts (active or conflict) of any core field change; the RE may switch it on manually for non-core changes but cannot switch it off. Implemented in #38 (blocked by #29 / PR #36).

## Next decision

- Phase 1 code merged (#7 closed); milestone stays open until #9 (exe on both machines) and #17 (icons) are checked at the office.
- Phase 2 — core domain in progress: G2 approved for metrics (#28 → PR #34) and KYC catalog/gate (#30 → PR #35). #29 KYC model merged (PR #36); ADR-0008 §7 material rule merged (PR #39). #27 customer lifecycle (PR #41, #42), #31 policy metrics (PR #43) and #32 RF + close rate (PR #44) merged — all golden cases G01–G22 pass. Next: #38, #33; #25, #26.
- Project-2 should adopt the upstream skill renames (`to-prd` → `to-spec`, `to-issues` → `to-tickets`).
