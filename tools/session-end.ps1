#Requires -Version 5.1
<#
.SYNOPSIS
    End a work session: commit everything as WIP (never on main) and push.

.DESCRIPTION
    Update docs/state/HANDOFF.md before running this (the /handoff command does it).
    On main, a wip/<machine>-<timestamp> branch is created first.

.PARAMETER Message
    Short description of the work in progress.
#>
[CmdletBinding()]
param(
    [string]$Message = 'session handoff'
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$branch = git branch --show-current
if ($branch -eq 'main') {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmm'
    $branch = "wip/$($env:COMPUTERNAME.ToLower())-$stamp"
    git switch -c $branch
}

if (git status --porcelain) {
    git add -A
    git commit -m "wip: $Message"
} else {
    Write-Host 'Nothing to commit.'
}

git push -u origin $branch
if ($LASTEXITCODE -ne 0) { throw 'git push failed - do not leave this machine until it succeeds.' }

git status -sb | Select-Object -First 1
Write-Host "Pushed $branch. Safe to switch machines." -ForegroundColor Green
