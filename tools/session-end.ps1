#Requires -Version 5.1
<#
.SYNOPSIS
    End a work session: commit this session's files as WIP (never on main) and push.

.DESCRIPTION
    Update HANDOFF (pinned issue, node tools/handoff.mjs) before running this (the /handoff command does it).
    Only the files named in -Paths are committed: another session may be using the same checkout
    (CLAUDE.md, "Môi trường Windows và 2 máy"), so there is no `git add -A`. With uncommitted
    changes and no -Paths, it lists them and stops without committing.
    On main, a wip/<machine>-<yyyyMMdd-HHmmss> branch is created first, and only when there is
    something to commit (otherwise nothing is created or pushed).

.PARAMETER Message
    Short description of the work in progress.

.PARAMETER Paths
    The files (or directories) this session changed, as git pathspecs, comma-separated
    (-Paths a.ts,docs/b.md).
#>
[CmdletBinding()]
param(
    [string]$Message = 'session handoff',
    [string[]]$Paths = @()
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

# `pwsh -File` passes "-Paths a,b" as one string: split it here.
$Paths = @($Paths | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })

$dirty = git status --porcelain
if ($LASTEXITCODE -ne 0) { throw "git status failed (exit $LASTEXITCODE)." }
if ($dirty -and $Paths.Count -eq 0) {
    git status --short
    throw 'Uncommitted changes but no -Paths: name the files this session changed (another session may own the rest).'
}

$branch = git branch --show-current
if (-not $branch) { throw 'Detached HEAD - switch to a branch before handing off.' }

$mine = if ($Paths.Count -gt 0) { git status --porcelain -- @Paths } else { $null }
if ($LASTEXITCODE -ne 0) { throw "git status failed (exit $LASTEXITCODE)." }
if ($branch -eq 'main') {
    # main is pushed only through PRs: with nothing to commit there is nothing to hand off.
    if (-not $mine) {
        Write-Host "Nothing to commit$(if ($Paths.Count -gt 0) { " in -Paths ($($Paths -join ', '))" }); main left as is." -ForegroundColor Yellow
        return
    }
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $branch = "wip/$($env:COMPUTERNAME.ToLower())-$stamp"
    Invoke-Git switch -c $branch
}

if ($mine) {
    Invoke-Git add -- @Paths
    # The pathspec keeps out anything another session staged.
    Invoke-Git commit -m "wip: $Message" -- @Paths
} elseif ($Paths.Count -gt 0) {
    Write-Host "Nothing to commit in -Paths ($($Paths -join ', '))." -ForegroundColor Yellow
} else {
    Write-Host 'Nothing to commit.'
}

Invoke-Git push -u origin $branch

git status -sb | Select-Object -First 1
Write-Host "Pushed $branch. Safe to switch machines." -ForegroundColor Green
