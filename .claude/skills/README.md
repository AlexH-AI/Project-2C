# Project skills

Vendored from [`mattpocock/skills`](https://github.com/mattpocock/skills) at commit `c55ee46073ed923f86ce59a5eb3b6d895095d1b7` (plugin v1.2.3), MIT — see `LICENSE-mattpocock-skills`. Copied unmodified; `agents/openai.yaml` files omitted. Approved at G4 on 2026-09-26 — see `docs/decisions/0012-plugins-superpowers-va-mattpocock-skills.md`.

| Skill | Upstream path | Notes |
|---|---|---|
| `grill-me` | `skills/productivity/grill-me` | Delegates to `grilling` |
| `grilling` | `skills/productivity/grilling` | Upstream says "dispatch a sub-agent" for fact lookups — in 2C the Agent tool is denied, so look facts up inline |
| `to-spec` | `skills/engineering/to-spec` | Replaces `to-prd` named in the plan |
| `to-tickets` | `skills/engineering/to-tickets` | Replaces `to-issues` named in the plan |
| `tdd` | `skills/engineering/tdd` | |
| `setup-matt-pocock-skills` | `skills/engineering/setup-matt-pocock-skills` | One-time config required by `to-spec` / `to-tickets` |

Not vendored: `review-pr` is 2C's own skill (ADR-0017). The `code-review` skill referenced by the vendored `tdd` skill is not installed; in 2C read it as `review-pr`.

To update: re-copy from a newer upstream commit, update the SHA above, and note it in ADR-0012.
