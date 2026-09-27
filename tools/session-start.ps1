#Requires -Version 5.1
<#
.SYNOPSIS
    Start a work session: sync with GitHub, show open work, print HANDOFF.md.
#>
[CmdletBinding()]
param()

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
    Write-Host "`n== issues in progress"
    gh issue list --label 'status:in-progress' --state open
} else {
    Write-Host "`n(gh not installed - skipping PR/issue listing)"
}

Write-Host "`n== toolchain"
& (Join-Path $PSScriptRoot 'bootstrap.ps1') -CheckOnly | Out-Host

Write-Host "`n== docs/state/HANDOFF.md"
foreach ($warning in $script:SyncWarnings) {
    Write-Host "WARNING: $warning - HANDOFF below may be stale" -ForegroundColor Red
}
Get-Content (Join-Path $RepoRoot 'docs\state\HANDOFF.md') -Encoding UTF8
