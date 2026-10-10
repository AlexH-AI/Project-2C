# Cấu hình OpenCode của hai phiên DeepSeek / Muse (chép nguyên văn)

Bản gốc: `C:\workspace\deep-review-5\common\opencode-deepseek.json` (đặt ở `C:\workspace\Project-2C-review\opencode.json` khi DeepSeek chạy) và `opencode-muse.json` (đặt ở `Project-2C-review-2`; Muse Code không đọc file này — `plan-opencode.md` §2 bước 4). Chép vào Markdown để `prettier --check` không đụng tới.

## opencode-deepseek.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/deepseek-v4.1-flash",
  "share": "disabled",
  "permission": {
    "task": "deny",
    "webfetch": "deny",
    "websearch": "deny",
    "read": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "glob": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny"
    },
    "grep": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny"
    },
    "list": {
      "*": "allow",
      "*deep-review-5": "ask",
      "*deep-review-5?": "ask",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny"
    },
    "external_directory": {
      "*": "ask",
      "*deep-review-5?common*": "allow",
      "*deep-review-5?deepseek*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "edit": {
      "*": "deny",
      "*deep-review-5?deepseek*": "allow"
    },
    "bash": {
      "*": "allow",
      "*deep-review-5*": "ask",
      "*deep-review-5?common*": "allow",
      "*deep-review-5?deepseek*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?muse*": "deny",
      "git commit*": "deny",
      "git push*": "deny",
      "git stash*": "deny",
      "git switch*": "deny",
      "git clean*": "deny",
      "git merge*": "deny",
      "git rebase*": "deny",
      "git checkout*": "deny",
      "git restore*": "deny",
      "git reset*": "deny",
      "gh *": "ask",
      "pnpm eval:ai*": "deny",
      "*tools/eval-ai.mjs*": "deny",
      "*tools?eval-ai.mjs*": "deny",
      "opencode *": "deny",
      "*auth export*": "deny",
      "*cmdkey*": "deny",
      "*CredentialManager*": "deny",
      "*chatgpt.com*": "deny",
      "curl *": "ask",
      "Invoke-WebRequest*": "ask",
      "Invoke-RestMethod*": "ask"
    }
  }
}
```

## opencode-muse.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/muse-spark-1.3-contributor",
  "share": "disabled",
  "permission": {
    "task": "deny",
    "webfetch": "deny",
    "websearch": "deny",
    "read": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "glob": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny"
    },
    "grep": {
      "*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny"
    },
    "list": {
      "*": "allow",
      "*deep-review-5": "ask",
      "*deep-review-5?": "ask",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny"
    },
    "external_directory": {
      "*": "ask",
      "*deep-review-5?common*": "allow",
      "*deep-review-5?muse*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "edit": {
      "*": "deny",
      "*deep-review-5?muse*": "allow"
    },
    "bash": {
      "*": "allow",
      "*deep-review-5*": "ask",
      "*deep-review-5?common*": "allow",
      "*deep-review-5?muse*": "allow",
      "*deep-review-5?claude*": "deny",
      "*deep-review-5?codex*": "deny",
      "*deep-review-5?deepseek*": "deny",
      "git commit*": "deny",
      "git push*": "deny",
      "git stash*": "deny",
      "git switch*": "deny",
      "git clean*": "deny",
      "git merge*": "deny",
      "git rebase*": "deny",
      "git checkout*": "deny",
      "git restore*": "deny",
      "git reset*": "deny",
      "gh *": "ask",
      "pnpm eval:ai*": "deny",
      "*tools/eval-ai.mjs*": "deny",
      "*tools?eval-ai.mjs*": "deny",
      "opencode *": "deny",
      "*auth export*": "deny",
      "*cmdkey*": "deny",
      "*CredentialManager*": "deny",
      "*chatgpt.com*": "deny",
      "curl *": "ask",
      "Invoke-WebRequest*": "ask",
      "Invoke-RestMethod*": "ask"
    }
  }
}
```
