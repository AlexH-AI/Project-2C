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

Write-Host '== git'
git fetch --all --prune --quiet
$branch = git branch --show-current
$dirty = git status --porcelain
Write-Host "Branch: $branch"
if ($dirty) {
    Write-Host 'Working tree has local changes - not pulling:' -ForegroundColor Yellow
    git status --short
} else {
    git pull --ff-only
}
git status -sb | Select-Object -First 1

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
Get-Content (Join-Path $RepoRoot 'docs\state\HANDOFF.md') -Encoding UTF8
