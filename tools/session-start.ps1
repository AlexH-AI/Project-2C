#Requires -Version 5.1
<#
.SYNOPSIS
    Start a work session: sync with GitHub, show open work, check the toolchain.

.DESCRIPTION
    Open PRs (head, latest REVIEW and its SHA, CI), open issues of the open milestone and
    worktrees come from tools/status.mjs. HANDOFF lives in the pinned issue labelled
    "handoff" and reaches Claude through the SessionStart hook, so it is not printed here
    unless -ShowHandoff is given (ADR-0003 appendix).

.PARAMETER ShowHandoff
    Also print HANDOFF (for a human at the terminal, or when the hook did not run).
#>
[CmdletBinding()]
param(
    [switch]$ShowHandoff
)

$ErrorActionPreference = 'Continue'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

# Any sync problem is repeated at the end so it cannot scroll out of sight.
$script:SyncWarnings = @()
function Write-SyncWarning([string]$Message) {
    Write-Host "WARNING: $Message" -ForegroundColor Red
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
    node (Join-Path $PSScriptRoot 'status.mjs')
    if ($LASTEXITCODE -ne 0) { Write-SyncWarning "tools/status.mjs failed (exit $LASTEXITCODE)" }
} else {
    Write-SyncWarning 'gh not installed - no PR/issue status and no HANDOFF (run tools/bootstrap.ps1)'
}

Write-Host "`n== toolchain"
& (Join-Path $PSScriptRoot 'bootstrap.ps1') -CheckOnly | Out-Host

Write-Host "`n== HANDOFF"
if ($ShowHandoff) {
    node (Join-Path $PSScriptRoot 'handoff.mjs') read
} else {
    Write-Host 'Pinned issue labelled "handoff", loaded by the SessionStart hook. Print it here with -ShowHandoff.'
}
foreach ($warning in $script:SyncWarnings) {
    Write-Host "WARNING: $warning" -ForegroundColor Red
}
