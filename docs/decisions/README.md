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
| [0001](0001-mo-hinh-thuc-hien-chi-claude-code.md) | Claude Code only, no subagents (model/effort: Owner picks per session, M1); gates G1–G8; auto-merge `risk:low` | Accepted (G1) | C1, C3, C4, C8, Q14 |
| [0002](0002-doi-chung-va-cach-ly-voi-project-2.md) | 2C is the control build; isolation from Project-2 | Accepted (G1) | C5, C6, C7 |
| [0003](0003-lien-tuc-cong-viec-giua-2-may.md) | GitHub as single source of truth across 2 machines | Accepted (G1) | §4.2 |
| [0004](0004-ung-dung-mot-nguoi-dung-khong-server.md) | Single-user local app, no server; roles are views | Accepted (G1) | Q1, Q2, Q16 |
| [0005](0005-tech-stack-tauri-2.md) | Tauri 2 + React/TS + SQLite (Drizzle), pnpm | Accepted (G1) | Q15 |
| [0006](0006-kien-truc-monorepo-va-ranh-gioi-module.md) | Monorepo layout and module boundaries | Accepted (G1) | §4.4 |
| [0007](0007-dinh-nghia-chi-so-va-vong-doi.md) | Metric definitions and customer/policy lifecycle | Accepted (G1); golden examples + data model Accepted (G2) | Q3–Q7 |
| [0008](0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md) | Structured KYC facts + deterministic gate | Accepted (G1); catalog + thresholds + golden profiles Accepted (G2) | Q8, Q9 |
| [0009](0009-ai-copilot-provider-va-guardrail.md) | AI copilot: OpenCode Go + Mock, schema + validator | Accepted (G1); prompts → G5, keys → G6 | Q10, Q11, C2 |
| [0010](0010-dong-bo-du-lieu-app-backup-va-repo-data.md) | App data sync: backup file + `Project-2C-data` repo | Accepted (G1) | Q2b |
| [0011](0011-bao-cao-excel-va-ngon-ngu.md) | Excel export; Vietnamese UI via i18n | Accepted (G1) | Q12, Q13 |
| [0012](0012-plugins-superpowers-va-mattpocock-skills.md) | Plugins: Superpowers + mattpocock/skills (vendored subset); Agent tool denied | Accepted (G4) | §4.3 |
| [0013](0013-huong-ui-dark-mode.md) | UI direction: dark tokens, champagne accent, unified period filter, sortable dates | Accepted (G3) | §4.6, C6 |
| [0014](0014-thu-vien-chart.md) | Chart library: ECharts 6 via echarts/core, own React wrapper | Accepted (G4) | §4.4 |
| [0015](0015-ci-build-exe-theo-nhu-cau.md) | CI: exe built on `main` or `build-exe`-labelled PRs; docs-only PRs skip CI; reopen per-PR exe build at Phase 3 | Accepted (G1/G4) | §4.4 |
| [0016](0016-luu-tru-sqljs-ghi-file-qua-rust.md) | Storage: sql.js everywhere; exe persists the DB file via a thin Rust command (amends 0006) | Accepted (G1/G4) | §4.4, Phase 3 |
| [0017](0017-review-theo-muc-risk.md) | PR review tiered by risk label via project skill `review-pr`; built-in `code-review` for med/high, report-only | Accepted (G1) | ADR-0001 §4 |

Phase 3 data model: `docs/design/phase-3-du-lieu.md` — Accepted (G2, 26/09/2026). ADR-0001 and ADR-0006 carry accepted addenda (task size P1; storage).
