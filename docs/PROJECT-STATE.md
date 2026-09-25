# Project-2C Current State

## Current phase

Phase 0 — requirements carried over from Project-2; repository bootstrap.

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

## Next decision

Start Phase 1 (foundation) on branch `phase-1/foundation`. Before first `to-spec` / `to-tickets`, run `/setup-matt-pocock-skills`. Project-2 should adopt the upstream skill renames (`to-prd` → `to-spec`, `to-issues` → `to-tickets`).
