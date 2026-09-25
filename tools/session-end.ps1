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

# $ErrorActionPreference does not catch native command failures: check the exit code every time.
function Invoke-Git {
    git @args
    if ($LASTEXITCODE -ne 0) {
        throw "git $($args -join ' ') failed (exit $LASTEXITCODE) - do not leave this machine until it succeeds."
    }
}

$branch = git branch --show-current
if (-not $branch) { throw 'Detached HEAD - switch to a branch before handing off.' }
if ($branch -eq 'main') {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmm'
    $branch = "wip/$($env:COMPUTERNAME.ToLower())-$stamp"
    Invoke-Git switch -c $branch
}

if (git status --porcelain) {
    Invoke-Git add -A
    Invoke-Git commit -m "wip: $Message"
} else {
    Write-Host 'Nothing to commit.'
}

Invoke-Git push -u origin $branch

git status -sb | Select-Object -First 1
Write-Host "Pushed $branch. Safe to switch machines." -ForegroundColor Green
