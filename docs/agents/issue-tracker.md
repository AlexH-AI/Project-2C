# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues in `AlexH-AI/Project-2C`. Use the `gh` CLI for all operations (run it from PowerShell on Windows).

## Project conventions

- Every task is one issue created from the **Task** template, `.github/ISSUE_TEMPLATE/task.yml`. That file is the only definition of the issue's sections: fill every field it has, in its order. Skills (`to-tickets`) point here and do not keep their own list.
- **File paths** in the issue body go only in two fields: "Tài liệu cần đọc" (paths + sections to read) and "File / thư mục được phép sửa" (paths or globs). Keep them out of the other fields; they go stale.
- **Docs to read** ("Tài liệu cần đọc") is required: the exact paths and sections (spec §, golden cases, mockup block, ADR appendix, the code files to change) the implementing session must read first. Fill it while writing the issue, when that context is at hand; `/session-start <issue>` reads only this list, so a missing entry costs a later session a search.
- **Related review notes** ("Ghi chú OPEN liên quan", T-261): while writing the issue, run `node tools/notes-for.mjs --files <the paths of "File / thư mục được phép sửa">` and copy its "Trùng file" notes of `docs/state/review-notes.md`, and every note whose target label is this work (`[<work name>]` from the spec's list of target names; the ledger PR relabels them `[T-… #…]` once the issue exists). Each OPEN note carries one target label, the work of the same kind that fixes it, and every note is done before v1.0 (Owner, 12/11/2026, ADR-0001 appendix M14): the task folds in every note with its label (they count toward its size), and leaves a note labelled for other work with `để lại → <label>`. A note that is too big or needs a gate moves to other work of the same kind (the PR says so, the ledger PR relabels it), never to no label. Notes are added after issues are written, so the implementing session runs `notes-for <issue>` again at the start, and the PR answers each "Trùng file" note of `notes-for --diff`.
- **Fix issues** ("Ngân sách", "Quét cùng mẫu", T-386): fill these two fields only when the issue fixes a finding: a deep review problem (`DR6-*`) or a note of the ledger. On any other issue leave both empty: `_No response_` under the two headings "Ngân sách" and "Quét cùng mẫu" (in the body file, write `_No response_` under the two headings), not "Không" or "—".
  - "Ngân sách": product lines / test lines, from the size estimate of the deep review synthesis or your own (a range is fine; review takes its upper bound).
  - "Quét cùng mẫu": the `rg` command or probe run, and every place with the same pattern (`path:line`), not only the places the finding names. Say where any part the issue leaves out goes: the ledger with its target label, or ACCEPTED.
  - A filled "Ngân sách" makes the PR a fix PR: it carries the three sections of the PR template ("Test đỏ khi gỡ phần sửa", "Quét cùng mẫu", "Cỡ so ngân sách"), and `review-pr` §3.A blocks it when one is missing or does not match the diff, and asks for changes when its size is over 1.5× the budget.
- Title: `T-xxx: <Vietnamese title>` — take the next free number from `gh issue list --state all --search "T- in:title"`.
- Labels: always `type:task` plus exactly one of `risk:low` / `risk:med` / `risk:high`. Add `gate` when the issue waits on an Owner gate (G1–G8), `status:in-progress` while being worked on, and `ready-for-agent` when fully specified.
- Milestone: the current phase, e.g. `Phase 1 — Nền móng`.
- Size: ≤ ~400 lines of product code and ≤ ~800 lines of total diff including tests per issue (generated files excluded — ADR-0001 addendum); split otherwise.
  - Estimate the size **when writing the issue**, counting everything the task will touch: product code, tests, i18n strings (`vi.ts`) and e2e specs. If the estimate is over the limit, split into several issues (or parts A/B/…) up front — do not discover it in the PR (P-2, Phase 3 closing review F-17).
  - Every PR lists each file it changes outside the issue's "files allowed to change", with the reason. An unlisted file outside the list is a blocking Spec finding in review.
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

The skills' "avoid file paths" rule holds except in the two path fields above ("Tài liệu cần đọc", "File / thư mục được phép sửa", e.g. `packages/db/**`), which `task.yml` requires.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
