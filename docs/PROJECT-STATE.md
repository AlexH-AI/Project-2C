# Project-2C Current State

## Current phase

Phase 4 — dashboard and reports (milestone "Phase 4 — Dashboard & báo cáo", opened 2026-10-02 with #251–#259). Phases 1, 2 and 3 are closed; Phase 3 closed at G7 on 2026-10-02 (57 issues, #57 to #245, `docs/metrics/phase-3.md`). Overall progress ≈ 60% to v1.0 (see `docs/PROJECT-PLAN.md` §5).

## Canonical repository

`AlexH-AI/Project-2C` (public since 2026-09-27; `main` protected by ruleset `protect-main` + pre-push hook)

## Canonical accepted branch

`main`

## Local workspace convention

`C:\workspace\Project-2C`

## Cross-machine synchronization

GitHub is the source of truth for Home PC <-> Office laptop continuity.

## Execution model

Claude Code only — Claude writes 100% of the code (since 2026-09-30 Codex joins only as an independent reviewer at phase close, ADR-0001 appendix M2), no subagents; the OWNER picks the model and effort for each session (ADR-0001 appendix M1, 2026-09-29; before: Opus 5.5, effort medium). Claude works autonomously except at OWNER approval gates G1–G8. See `docs/PROJECT-PLAN.md` §4.1 and §7.2.

## Current OWNER decisions

- 2026-09-26: Project-2C created as the Claude-only control build of Project-2 (decisions C1–C8 in `docs/PROJECT-PLAN.md` §7.2).
- Product requirements = Project-2 decisions Q1–Q16 (inherited unchanged).
- Project-2C is built first; Project-2 (multi-agent) follows after 2C is complete.
- Isolation and comparison rules: `docs/COMPARISON.md`.

- 2026-09-26: Decisions recorded as ADR-0001…0012 in `docs/decisions/`.
- 2026-09-26: G4 approved — Superpowers 6.4.2 (project-scope plugin) + mattpocock/skills subset vendored in `.claude/skills/`; Agent tool denied in `.claude/settings.json` (ADR-0012).

- 2026-09-26: #3 — Claude merges `risk:low` PRs when CI is green and the clean-session review passes; local pre-push hook blocks direct pushes to `main` (GitHub ruleset added 2026-09-28, below).
- 2026-09-26: G3 approved — UI direction recorded as ADR-0013 (PR #13), score 8/10.
- 2026-09-26: PR #10 merged (#1, #2, #3 closed).
- 2026-09-26: G2 — close rate and RF definitions replaced (Q3/Q3c, Q4 superseded); ADR-0007 is the source of truth, `docs/PROJECT-PLAN.md` §2.3 synced.
- 2026-09-26: KYC version `material` flag (ADR-0008 §7) — first version always material; later versions material when the current facts (active or conflict) of any core field change; the RE may switch it on manually for non-core changes but cannot switch it off. Implemented in #38 (blocked by #29 / PR #36).
- 2026-09-26: Phase 2 closed at G7 (10/10 issues, golden G01–G22 and K01–K15, `docs/metrics/phase-2.md`). Phase 3 planned: G2 data model `docs/design/phase-3-du-lieu.md`, G1/G4 ADR-0016 (sql.js everywhere, thin Rust file command), G1 P1 task size (≤ ~400 product lines, ≤ ~800 total incl. tests).
- 2026-09-28: Phase 1 closed at G7 (`docs/metrics/phase-1.md`). Repo is public, so OWNER enabled GitHub ruleset `protect-main`: PR required, no force-push, no deletion; no required status checks (docs-only PRs run no CI) and no auto-merge. The pre-push hook stays.
- 2026-09-28: OWNER decision — delete merged branches right after every merge (steps in `CLAUDE.md`).
- 2026-09-29: ADR-0001 appendix M1 — the OWNER picks the Claude Code model and effort for each session.
- 2026-09-30: ADR-0001 appendix M2 (#198) — Codex joins 2C only as an independent reviewer at phase close (run by the OWNER); it does not write code or review task PRs; Claude checks each finding before filing Issues or fixing.
- 2026-09-30: Review process rules P-1…P-3 (Phase 1→3 big review, `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`): merge only at the SHA in the latest `REVIEW: PASS`; task size estimated with i18n + e2e; non-blocking review notes kept in a ledger, now `docs/state/review-notes.md`.
- 2026-10-01: OWNER's 16 requests after testing the exe and the decisions on them: `docs/reviews/2026-10-01-phan-hoi-owner-kiem-exe.md` (batches A + B done in Phase 3, request 9 in Phase 4).
- 2026-10-02: The data is simulated: when a rule tightens, inconsistent existing data is refused or removed (OWNER reloads the demo data), not migrated or shown in the UI (R2-02, #252).
- 2026-10-02: Phase 3 closed at G7 after two independent reviews (`docs/reviews/`) and two manual exe checks (`docs/metrics/phase-3.md`). Phase 4 opened.
- 2026-10-03: Retro on agent navigation (#280): HANDOFF kept short and loaded by the SessionStart hook from `origin/main`; review notes, the Office Laptop setup and the 01/10 feedback moved to their own files; raw phase-close review reports live in `docs/reviews/raw/`.

## Next decision

Session-level state and the exact next step: `docs/state/HANDOFF.md`. Task order and progress: the open milestone on GitHub. Phase plan: `docs/PROJECT-PLAN.md` §5.

## Notes

- Project-2 should adopt the upstream skill renames (`to-prd` → `to-spec`, `to-issues` → `to-tickets`).
- ADR-0003 still mentions `/resume` and branch protection; the actual practice is `/session-start` and the pre-push hook + ruleset. Left as-is (accepted ADR text); `CLAUDE.md` and the plan are current.
