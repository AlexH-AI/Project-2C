# Project-2C Decisions

This directory records durable Project-2C design and workflow decisions.

Project-2 decision records are not inherited automatically, except the product requirements (Q1–Q16) listed in `docs/PROJECT-PLAN.md` §7.

When a decision is accepted, record:

- decision
- context
- alternatives considered
- rationale
- consequences
- date
- relevant commit / pull request

File naming: `NNNN-short-slug.md`. Status: `Proposed` → `Accepted (<gate>)` → optionally `Superseded by ADR-NNNN`.

## Index

| ADR | Decision | Status | Source |
|---|---|---|---|
| [0001](0001-mo-hinh-thuc-hien-chi-claude-code.md) | Claude Code only (subagents / Workflow allowed since 2026-10-17 — M8; model/effort: Owner picks per session, M1); gates G1–G8; auto-merge `risk:low`; Codex (M2) and, at the Phase 6 close, Muse (M4; DeepSeek dropped — M5; Muse Spark 1.3 on the Office Laptop — M6; Muse dropped from round 2, any machine — M7; round 3 with Claude and Codex, the Claude side one fresh session per package as in round 2 — M9, amended 2026-10-20; round 4 with Claude Opus 5.5, Codex on GPT Sol 6.1 and DeepSeek v4.1 Flash on OpenCode, run once every open review note is fixed — M10) review read-only; kept because it proved itself, not as a control build (M3) | Accepted (G1); M3, M4 Accepted (G1, 2026-10-11); M5 Accepted (G1, 2026-10-13); M6 Accepted (G1, 2026-10-14); M7, M8 Accepted (G1, 2026-10-17); M9 Accepted (G1, 2026-10-19); M10 Accepted (G1, 2026-10-27) | C1, C3, C4, C8, Q14 |
| [0002](0002-doi-chung-va-cach-ly-voi-project-2.md) | 2C is the control build; isolation from Project-2 | **Superseded** (2026-10-11: comparison dropped, Project-2 stopped) | C5, C6, C7 |
| [0003](0003-lien-tuc-cong-viec-giua-2-may.md) | GitHub as single source of truth across 2 machines; appendix: HANDOFF in the pinned `handoff` issue, generated session status | Accepted (G1); appendix Accepted (G1, #283) | §4.2 |
| [0004](0004-ung-dung-mot-nguoi-dung-khong-server.md) | Single-user local app, no server; roles are views | Accepted (G1) | Q1, Q2, Q16 |
| [0005](0005-tech-stack-tauri-2.md) | Tauri 2 + React/TS + SQLite (Drizzle), pnpm | Accepted (G1) | Q15 |
| [0006](0006-kien-truc-monorepo-va-ranh-gioi-module.md) | Monorepo layout and module boundaries | Accepted (G1) | §4.4 |
| [0007](0007-dinh-nghia-chi-so-va-vong-doi.md) | Metric definitions and customer/policy lifecycle | Accepted (G1); golden examples + data model Accepted (G2) | Q3–Q7 |
| [0008](0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md) | Structured KYC facts + deterministic gate | Accepted (G1); catalog + thresholds + golden profiles Accepted (G2) | Q8, Q9 |
| [0009](0009-ai-copilot-provider-va-guardrail.md) | AI copilot: OpenCode Go + Mock, schema + validator | Accepted (G1); network + keys Accepted (D-1, G4 / G6, 2026-10-07); prompts → G5 | Q10, Q11, C2 |
| [0010](0010-dong-bo-du-lieu-app-backup-va-repo-data.md) | App data sync: backup file + `Project-2C-data` repo | Accepted (G1); `Project-2C-data` out of v1.0 (2026-10-11), cloud backup to be decided later | Q2b |
| [0011](0011-bao-cao-excel-va-ngon-ngu.md) | Excel export; Vietnamese UI via i18n | Accepted (G1) | Q12, Q13 |
| [0012](0012-plugins-superpowers-va-mattpocock-skills.md) | Plugins: Superpowers + mattpocock/skills (vendored subset); Agent tool denied until 2026-10-17 (appendix: allowed, ADR-0001 M8) | Accepted (G4) | §4.3 |
| [0013](0013-huong-ui-dark-mode.md) | UI direction: dark tokens, champagne accent, unified period filter, sortable dates | Accepted (G3) | §4.6, C6 |
| [0014](0014-thu-vien-chart.md) | Chart library: ECharts 6 via echarts/core, own React wrapper | Accepted (G4) | §4.4 |
| [0015](0015-ci-build-exe-theo-nhu-cau.md) | CI: exe built on `main` or `build-exe`-labelled PRs; docs-only PRs skip CI; reopen per-PR exe build at Phase 3 | Accepted (G1/G4) | §4.4 |
| [0016](0016-luu-tru-sqljs-ghi-file-qua-rust.md) | Storage: sql.js everywhere; exe persists the DB file via a thin Rust command (amends 0006) | Accepted (G1/G4) | §4.4, Phase 3 |
| [0017](0017-review-theo-muc-risk.md) | PR review tiered by risk label via project skill `review-pr`; built-in `code-review` at every tier since 2026-10-21 (low `high`, med `max`, high `max --max-findings all`), report-only | Accepted (G1); `code-review` levels appendix Accepted (G1, 2026-10-21, #730) | ADR-0001 §4 |

Phase 3 data model: `docs/design/phase-3-du-lieu.md` — Accepted (G2, 26/09/2026). ADR-0001 and ADR-0006 carry accepted addenda (task size P1; storage).
