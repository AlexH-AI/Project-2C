#Requires -Version 5.1
<#
.SYNOPSIS
    Install or verify the Project-2C toolchain on a Windows 11 x64 machine. Idempotent.

.DESCRIPTION
    Uses winget for system tools, corepack for pnpm (version pinned in package.json),
    and rustup for the Rust toolchain (pinned in rust-toolchain.toml).

.PARAMETER CheckOnly
    Only report what is installed or missing; change nothing.

.EXAMPLE
    pwsh -File tools/bootstrap.ps1
    pwsh -File tools/bootstrap.ps1 -CheckOnly
#>
[CmdletBinding()]
param(
    [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$script:Missing = @()

function Update-SessionPath {
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user = [Environment]::GetEnvironmentVariable('Path', 'User')
    $cargo = Join-Path $env:USERPROFILE '.cargo\bin'
    $env:Path = "$machine;$user;$cargo"
}

function Test-Command([string]$Name) {
    [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Write-Status([string]$Name, [bool]$Ok, [string]$Detail) {
    $mark = if ($Ok) { '[ok]     ' } else { '[missing]' }
    Write-Host ("{0} {1,-18} {2}" -f $mark, $Name, $Detail)
    if (-not $Ok) { $script:Missing += $Name }
}

function Install-WingetPackage([string]$Id, [string[]]$ExtraArgs = @()) {
    if ($CheckOnly) { return }
    Write-Host "  -> winget install $Id"
    $wingetArgs = @('install', '--id', $Id, '--exact', '--source', 'winget',
        '--accept-package-agreements', '--accept-source-agreements', '--silent') + $ExtraArgs
    & winget @wingetArgs
    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189) {
        # -1978335189 = APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE (already installed)
        throw "winget install $Id failed with exit code $LASTEXITCODE"
    }
    Update-SessionPath
}

function Get-VsBuildToolsPath {
    $vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
    if (-not (Test-Path $vswhere)) { return $null }
    $path = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    if ($path) { return $path } else { return $null }
}

function Test-WebView2 {
    $keys = @(
        'HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}',
        'HKCU:\Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}'
    )
    foreach ($key in $keys) {
        $pv = (Get-ItemProperty -Path $key -Name pv -ErrorAction SilentlyContinue).pv
        if ($pv -and $pv -ne '0.0.0.0') { return $pv }
    }
    return $null
}

Write-Host "Project-2C bootstrap ($(if ($CheckOnly) { 'check only' } else { 'install' }))"
Write-Host "Repo: $RepoRoot`n"

if (-not $CheckOnly -and -not (Test-Command 'winget')) {
    throw 'winget is required. Install "App Installer" from the Microsoft Store.'
}

# Git
if (-not (Test-Command 'git')) { Install-WingetPackage 'Git.Git' }
Write-Status 'git' (Test-Command 'git') $(if (Test-Command 'git') { (git --version) } else { '' })
if (-not $CheckOnly -and (Test-Command 'git')) {
    git config --global core.longpaths true
}

# Node.js (major version from .nvmrc)
$nodeMajor = (Get-Content (Join-Path $RepoRoot '.nvmrc') -Raw).Trim()
$nodeOk = (Test-Command 'node') -and ((node --version) -match "^v$nodeMajor\.")
if (-not $nodeOk) { Install-WingetPackage 'OpenJS.NodeJS.LTS' }
$nodeOk = (Test-Command 'node') -and ((node --version) -match "^v$nodeMajor\.")
Write-Status 'node' $nodeOk $(if (Test-Command 'node') { "$(node --version) (want v$nodeMajor.x)" } else { "want v$nodeMajor.x" })

# pnpm via corepack (version pinned by "packageManager" in package.json)
if (-not (Test-Command 'pnpm') -and -not $CheckOnly -and (Test-Command 'corepack')) {
    $env:COREPACK_ENABLE_DOWNLOAD_PROMPT = '0'
    corepack enable pnpm 2>$null
    if ($LASTEXITCODE -ne 0) {
        # Node in Program Files is not writable without admin: put the shims in a user dir on PATH.
        $shimDir = Join-Path $env:APPDATA 'npm'
        New-Item -ItemType Directory -Force $shimDir | Out-Null
        corepack enable pnpm --install-directory $shimDir
        if ($LASTEXITCODE -ne 0) { throw 'corepack enable pnpm failed' }
        $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
        if (($userPath -split ';') -notcontains $shimDir) {
            [Environment]::SetEnvironmentVariable('Path', "$userPath;$shimDir", 'User')
        }
    }
    Update-SessionPath
}
Write-Status 'pnpm' (Test-Command 'pnpm') $(if (Test-Command 'pnpm') { "$(pnpm --version)" } else { 'via corepack' })

# Rust (toolchain pinned in rust-toolchain.toml; rustup installs it on first cargo use)
Update-SessionPath
if (-not (Test-Command 'rustup')) { Install-WingetPackage 'Rustlang.Rustup' }
if (-not $CheckOnly -and (Test-Command 'rustup')) {
    Push-Location $RepoRoot
    try { rustup show active-toolchain *> $null; rustup toolchain install } finally { Pop-Location }
}
Write-Status 'rust' (Test-Command 'cargo') $(if (Test-Command 'rustc') { (rustc --version) } else { '' })

# MSVC build tools (required by Rust on Windows)
if (-not (Get-VsBuildToolsPath)) {
    Install-WingetPackage 'Microsoft.VisualStudio.2022.BuildTools' @(
        '--override', '--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended'
    )
}
$vs = Get-VsBuildToolsPath
Write-Status 'msvc-build-tools' ([bool]$vs) $(if ($vs) { $vs } else { 'VC Tools workload' })

# GitHub CLI
if (-not (Test-Command 'gh')) { Install-WingetPackage 'GitHub.cli' }
$ghOk = Test-Command 'gh'
Write-Status 'gh' $ghOk $(if ($ghOk) { (gh --version | Select-Object -First 1) } else { '' })
if ($ghOk) {
    gh auth status *> $null
    Write-Status 'gh auth' ($LASTEXITCODE -eq 0) $(if ($LASTEXITCODE -eq 0) { 'logged in' } else { 'run: gh auth login' })
}

# WebView2 runtime (ships with Windows 11)
$wv2 = Test-WebView2
Write-Status 'webview2' ([bool]$wv2) $(if ($wv2) { $wv2 } else { 'install Microsoft.EdgeWebView2Runtime' })

# JS dependencies
if (-not $CheckOnly -and (Test-Command 'pnpm') -and (Test-Path (Join-Path $RepoRoot 'package.json'))) {
    Push-Location $RepoRoot
    try { pnpm install --frozen-lockfile } finally { Pop-Location }
}

Write-Host ''
if ($script:Missing.Count -gt 0) {
    Write-Host "Missing: $($script:Missing -join ', ')" -ForegroundColor Yellow
    Write-Host 'Open a new terminal (PATH changes) and re-run this script.'
    exit 1
}
Write-Host 'Toolchain ready.' -ForegroundColor Green
