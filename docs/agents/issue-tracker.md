# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues in `AlexH-AI/Project-2C`. Use the `gh` CLI for all operations (run it from PowerShell on Windows).

## Project conventions

- Every task is one issue created from the **Task** template (`.github/ISSUE_TEMPLATE/task.yml`): goal, context, files allowed to change, contract, acceptance tests, definition of done, risk.
- Title: `T-xxx: <Vietnamese title>` — take the next free number from `gh issue list --state all --search "T- in:title"`.
- Labels: always `type:task` plus exactly one of `risk:low` / `risk:med` / `risk:high`. Add `gate` when the issue waits on an Owner gate (G1–G8), `status:in-progress` while being worked on, and `ready-for-agent` when fully specified.
- Milestone: the current phase, e.g. `Phase 1 — Nền móng`.
- Size: ≤ ~400 lines of product code and ≤ ~800 lines of total diff including tests per issue (generated files excluded — ADR-0001 addendum); split otherwise.
- Write issue bodies in Vietnamese; code identifiers stay in English.

## Conventions

- **Create an issue**: write the body to a file, then `gh issue create --title "..." --label "type:task,risk:low" --milestone "..." --body-file <file>`.
- **Read an issue**: `gh issue view <number> --comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label`, `--milestone` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."` — normally closed by a PR with `Closes #<n>`.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Single-owner repo; there are no external PRs.)_

GitHub shares one number space across issues and PRs, so a bare `#42` may be either: resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## Blocking edges

Put `Bị chặn bởi: #<n>, #<n>` in the issue's "Bị chặn bởi" field (or `Không`). Where GitHub native issue dependencies are available, also add them: `gh api --method POST repos/AlexH-AI/Project-2C/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` (database id from `gh api repos/AlexH-AI/Project-2C/issues/<n> --jq .id`). An issue is unblocked when every blocker is closed.

## When a skill says "publish to the issue tracker"

Create a GitHub issue following the project conventions above.

The Task template's "files allowed to change" field is required and overrides the skills' "avoid file paths" rule: list paths or globs there (e.g. `packages/db/**`); keep them out of the rest of the body.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
