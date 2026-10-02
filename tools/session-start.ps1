#Requires -Version 5.1
<#
.SYNOPSIS
    Start a work session: sync with GitHub, show open work, check the toolchain.

.DESCRIPTION
    HANDOFF.md reaches Claude through the SessionStart hook (.claude/hooks/handoff-context.mjs,
    origin/main copy), so it is not printed here unless -ShowHandoff is given.

.PARAMETER ShowHandoff
    Also print docs/state/HANDOFF.md (for a human at the terminal, or when the hook did not run).
#>
[CmdletBinding()]
param(
    [switch]$ShowHandoff
)

$ErrorActionPreference = 'Continue'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

# Any sync problem is repeated right above HANDOFF so it cannot scroll out of sight.
$script:SyncWarnings = @()
function Write-SyncWarning([string]$Message) {
    Write-Host "WARNING: $Message - HANDOFF may be stale" -ForegroundColor Red
    $script:SyncWarnings += $Message
}

Write-Host '== git'
git fetch --all --prune --quiet
if ($LASTEXITCODE -ne 0) { Write-SyncWarning "git fetch failed (exit $LASTEXITCODE)" }
$branch = git branch --show-current
$dirty = git status --porcelain
if (-not $branch) {
    # Detached HEAD (e.g. the review worktree): nothing to pull, show where we stand instead.
    $head = git rev-parse --short HEAD
    $originMain = git rev-parse --short origin/main
    Write-Host "Detached HEAD at $head; origin/main is $originMain"
    if ($head -ne $originMain) { Write-SyncWarning "HEAD $head is not origin/main $originMain" }
} else {
    Write-Host "Branch: $branch"
    if ($dirty) {
        Write-Host 'Working tree has local changes - not pulling:' -ForegroundColor Yellow
        git status --short
    } else {
        git pull --ff-only
        if ($LASTEXITCODE -ne 0) { Write-SyncWarning "git pull --ff-only failed (exit $LASTEXITCODE)" }
    }
    git status -sb | Select-Object -First 1
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "`n== open pull requests"
    gh pr list --state open
    # Open issues of the open milestone (lowest number = current phase).
    $milestone = gh api 'repos/{owner}/{repo}/milestones?state=open' --jq 'sort_by(.number) | .[0].title // empty'
    if ($LASTEXITCODE -eq 0 -and $milestone) {
        Write-Host "`n== open issues: $milestone"
        gh issue list --milestone $milestone --state open --limit 50
    } else {
        Write-Host "`n(no open milestone)"
    }
} else {
    Write-Host "`n(gh not installed - skipping PR/issue listing)"
}

Write-Host "`n== toolchain"
& (Join-Path $PSScriptRoot 'bootstrap.ps1') -CheckOnly | Out-Host

Write-Host "`n== docs/state/HANDOFF.md"
foreach ($warning in $script:SyncWarnings) {
    Write-Host "WARNING: $warning - HANDOFF may be stale" -ForegroundColor Red
}
git diff --quiet origin/main -- docs/state/HANDOFF.md
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Local HANDOFF.md differs from origin/main (the hook showed the origin/main copy): read the local file if this branch edits it.' -ForegroundColor Yellow
}
if ($ShowHandoff) {
    Get-Content (Join-Path $RepoRoot 'docs\state\HANDOFF.md') -Encoding UTF8
} else {
    Write-Host 'Loaded by the SessionStart hook (origin/main copy). Print it here with -ShowHandoff.'
}
