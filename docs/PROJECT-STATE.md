# Project-2C Current State

## Current phase

Phase 3 — business screens and data (milestone "Phase 3 — Nghiệp vụ & màn hình", 43 issues from #57 to #210). Open: the OWNER's exe feedback of 2026-10-01 (#214–#217, then B1–B6) and #72 T-053 (phase close), which waits for that work, a new manual exe check, two independent reviews and G7. Phases 1 and 2 are closed. Overall progress ≈ 60% to v1.0 once Phase 3 closes (see `docs/PROJECT-PLAN.md` §5).

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

- 2026-09-26: #3 — GitHub Free has no branch protection for private repos; OWNER chose local enforcement (pre-push hook) + Claude merges `risk:low` PRs when CI is green.
- 2026-09-26: G3 approved — UI direction recorded as ADR-0013 (PR #13), score 8/10.
- 2026-09-26: PR #10 merged (#1, #2, #3 closed).
- 2026-09-26: G2 — close rate and RF definitions replaced (Q3/Q3c, Q4 superseded); ADR-0007 is the source of truth, `docs/PROJECT-PLAN.md` §2.3 synced.
- 2026-09-26: KYC version `material` flag (ADR-0008 §7) — first version always material; later versions material when the current facts (active or conflict) of any core field change; the RE may switch it on manually for non-core changes but cannot switch it off. Implemented in #38 (blocked by #29 / PR #36).

## Next decision

- Phase 1 closed 2026-09-28 (G7, 18/18 issues; see the 2026-09-28 entries below).
- Phase 2 — core domain: G2 approved for metrics (#28 → PR #34) and KYC catalog/gate (#30 → PR #35). Merged: #29 KYC model (PR #36), ADR-0008 §7 material rule (PR #39), #27 customer lifecycle (PR #41, #42), #31 policy metrics (PR #43), #32 RF + close rate (PR #44), #38 material flag (PR #46), #33 KYC gate (PR #47), #25 quick date (PR #51), #26 VND money (PR #52). All 10 milestone issues closed. Golden cases G01–G22 and K01–K15 pass; 279 tests, domain coverage 100%. Metrics: `docs/metrics/phase-2.md`. Closing review (2026-09-26): no defects found. **Milestone closed 2026-09-26 (G7, Owner approved).**
- 2026-09-26: Phase 3 planned. G2 data model `docs/design/phase-3-du-lieu.md` (D1–D8), G1/G4 ADR-0016 (sql.js everywhere, thin Rust file command; deps drizzle-orm, drizzle-kit, sql.js), G1 P1 task size (≤ ~400 product lines, ≤ ~800 total incl. tests) — PR #58. First issues #59–#72 (the milestone grew to 43 with follow-ups and review fixes); next: #60 (packages/db foundation) and #59 (input-screen mockups → G3).
- 2026-09-27: `packages/db` foundation + customers merged (#74, #76, #77); T-042c/d in PR #78/#79. G3 input-screen mockups approved and merged (#75), post-merge review fixes #81; G2 addendum D9 `appointments.outcome_reviewer_id` (#80). Issues #68/#69 updated to match. Next: finish T-042 (db), then #63/#64, then UI #65–#70.
- 2026-09-28: Repo is public, so OWNER enabled GitHub ruleset `protect-main` on `main`: PR required, no force-push, no deletion. No required status checks (docs-only PRs run no CI) and no auto-merge. The pre-push hook stays. Supersedes the 2026-09-26 #3 note.
- 2026-09-28: OWNER set the order #91 (close app on save error) → #65 T-046 (Team & staff) → #89 (block second exe) → #90 (prune backups by mtime). #91 goes first so the first DB-writing screen is built on `PersistQueue` with pending state and `flush()`. #88 was done in PR #118.
- 2026-09-28: #91 T-057 merged (PR #125, `86b4e2c`): `PersistQueue.flush()` + exe close guard; Owner's manual exe check passed. Next: #65 T-046.
- 2026-09-29: Phase 3 progress — closed #91, #65, #89, #90, #66, #131, #145, #67 (KYC in the customer profile, PRs #148–#150) and #151 (single source for profile-only KYC fields, PR #152, `f0608ca`). Open: #68 → #69 → #70 (Owner's order), #142 when free, then #71 backup (`risk:high`) and #72 phase close (G7).
- 2026-09-28: Office checks done: #9 exe runs on Office Laptop, `docs/metrics/phase-1.md` written (PR #127); #17 icons in ADR-0013 colors merged (PR #128, `fbd23d7`). Phase 1 milestone has 0 open issues — waiting for OWNER to close it (G7). Next: #65 T-046.
- 2026-09-28: Phase 1 milestone closed (G7). Owner's order done through #66: #65 T-046 Team (PR #132/#133; Staff split to #131), #89 T-055 (PR #134), #90 T-056 (PR #136), #66 T-047 Customers (stacked PRs #138–#141, `c87f045`). New #142 T-065 (customer form closer to mockups 5a–5c, not urgent). Next: OWNER picks the order of #131, #67–#70, #142.
- 2026-09-28: #131 T-064 Staff merged (PR #144, `a1fb6ab`); #145 T-066 public `addDays` in `domain` merged (PR #146, `3ca0448`). Open in Phase 3: #67–#70, #142, then #71, #72. Next: OWNER picks the order (default #67 → #68 → #69 → #70).
- 2026-09-29: #68 T-049 (PRs #162–#165) and #69 T-050 meeting outcomes (A #166, B1/B2 #168/#169, C1/C2 #170/#171, `76072d9`) merged; #69 closed. Open in Phase 3: #70 T-051 contracts (next), #142 when free, then #71 backup (`risk:high`) and #72 phase close (G7).
- 2026-09-30: #70 T-051 contracts merged (PRs #174/#175, `1d0593a`) and closed. #142 T-065 in PR #177 (`risk:med`, waiting for CI + clean review). Next: #173 T-068 (delete a planned appointment, `risk:low`) in the same review round, then #71 backup (`risk:high`) and #72 phase close (G7).
- 2026-09-30: #71 T-052 backup (PRs #184/#185), follow-ups #187/#189/#191 (T-071–T-073), #186 T-070 Settings → Data card (PR #194) and #195 T-074 Explorer comma path (PR #196, `724794a`) merged. Only #72 T-053 (phase close, G7) remains open in Phase 3.
- 2026-09-30: Phase 1→3 big review at `0fa0eea` (clean Claude session + Codex Astra, independent; merged into findings F-01…F-19). Verdict: do not close G7 yet. Batch 1 before G7: #202 T-077 (DB replace must not silently stop saving + ErrorBoundary), #203 T-078 (backup import per-cell validation + 100 MB limit, OWNER decision), #204 T-079 (backup import cross-table invariants, blocked by #203), then #72 (docs drift F-10, process rules P-1…P-3, manual exe check after the fixes). Batch 2 Issues are filed when Phase 4 starts. Reports live outside the repo on `D13_THINKPAD` until #72 copies the merged report into `docs/reviews/`.
- 2026-09-29: ADR-0001 appendix M1 — the OWNER picks the Claude Code model and effort for each session; the repo no longer pins "Opus 5.5, effort medium".
- 2026-09-30: ADR-0001 appendix M2 (Issue #198) — Codex joins 2C only as an independent reviewer at phase close (run by the OWNER); it does not write code or review task PRs. Its report adds to, not replaces, the clean-session review; Claude checks each finding before filing Issues or fixing. Claude still writes 100% of the code; OpenCode (CLI), Muse Code, Cursor stay out; no subagents.
- 2026-09-30: Batch 1 of the big review merged: #202 T-077 (PR #206), #203 T-078 (PR #208, backup import checks every value, 100 MB limit), #204 T-079 (PR #209, cross-table invariants), #210 T-080 (PR #211, tests). `main` `abdff20`: `pnpm verify` 757 tests, `pnpm e2e` 95/95, exe build green. #72 T-053: `docs/metrics/phase-3.md`, the merged review report in `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, docs drift F-10 fixed, review process rules P-1…P-3 (skill `review-pr`, `docs/agents/issue-tracker.md`, HANDOFF ledger) and the ECharts escape item in `docs/process/REVIEW-CHECKLIST.md` (F-18). Waiting for the OWNER: manual exe check, then G7.
- 2026-10-01: OWNER tested the exe and sent 16 UI/feature requests (full list and decisions in `docs/state/HANDOFF.md`, "Phản hồi Owner sau kiểm exe"). OWNER approved the plan: batch A (#214 T-081 labels, #215 T-082 RE order by team, #216 T-083 scope picker size + only on Customers/Appointments) and batch B (#217 T-084 mockup → G3 → B1–B6: Team header with TL, RE chip row on Customers/Appointments shared by both tabs, week/custom range highlight, date colouring, 12-month year grid) are done in Phase 3 **before G7**; G7 waits for a new manual exe check and two independent reviews. Request 9 (Overview on real data: stage counts as an end-of-period snapshot, 1 chart for All/RE, 3 charts for Team) moves to Phase 4 with G2 + G3.
- 2026-10-01: batch A (#214 T-081, #215 T-082, #216 T-083), the G3 mockup (#217 T-084, PR #220) and B1 (#222 T-085, PR #231) merged. Next: #223 T-086 (one TL per team), then B2–B6 (#224–#228) in order, then the manual exe check, two independent reviews and G7 (#72).
- Project-2 should adopt the upstream skill renames (`to-prd` → `to-spec`, `to-issues` → `to-tickets`).
- ADR-0003 still mentions `/resume` and branch protection; the actual practice is `/session-start` and the pre-push hook (#3). Left as-is (accepted ADR text); `CLAUDE.md` and the plan are current.
