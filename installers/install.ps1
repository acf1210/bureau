# BUREAU installer for Windows PowerShell 5.1+ / PowerShell 7.
# Usage: powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
[CmdletBinding()]
param(
  [ValidateSet("claude", "codex", "antigravity", "hermes", "all")]
  [string]$Agent = "all",
  [ValidateSet("user", "project")]
  [string]$Scope = "user",
  [switch]$DryRun,
  [switch]$Link,
  [switch]$Force,
  [switch]$Uninstall,
  [switch]$NoCommand,
  [switch]$WithAgents
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$SkillSrc = Join-Path $RepoRoot "skill"
$VersionFile = Join-Path $RepoRoot "VERSION"
$Version = if (Test-Path $VersionFile) { (Get-Content $VersionFile -Raw).Trim() } else { "6.0.0" }
$Stamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$Marker = ".bureau-installed"
$ProjectRoot = (Get-Location).Path
$HomeDir = $env:USERPROFILE

function Write-Say($text) { Write-Host $text }

function Invoke-Step($label, [scriptblock]$action) {
  if ($DryRun) { Write-Say "  [dry-run] $label" }
  else { & $action }
}

function Get-Targets([string]$targetAgent) {
  $result = @{ Skill = $null; Command = $null; Rule = $null }
  switch ($targetAgent) {
    "claude" {
      if ($Scope -eq "user") {
        $result.Skill = Join-Path $HomeDir ".claude\skills\bureau"
        $result.Command = Join-Path $HomeDir ".claude\commands\bureau.md"
      } else {
        $result.Skill = Join-Path $ProjectRoot ".claude\skills\bureau"
        $result.Command = Join-Path $ProjectRoot ".claude\commands\bureau.md"
      }
    }
    "codex" {
      if ($Scope -eq "user") { $result.Skill = Join-Path $HomeDir ".codex\skills\bureau" }
      else { $result.Skill = Join-Path $ProjectRoot ".codex\skills\bureau" }
    }
    "antigravity" {
      if ($Scope -eq "user") {
        $result.Skill = Join-Path $HomeDir ".gemini\config\skills\bureau"
        $result.Rule = Join-Path $HomeDir ".gemini\config\rules\bureau.md"
      } else {
        $result.Skill = Join-Path $ProjectRoot ".agents\skills\bureau"
        $result.Rule = Join-Path $ProjectRoot ".agents\rules\bureau.md"
      }
    }
    "hermes" {
      if ($Scope -eq "user") { $result.Skill = Join-Path $HomeDir ".hermes\skills\creative\bureau" }
      else { $result.Skill = Join-Path $ProjectRoot ".hermes\skills\bureau" }
    }
  }
  return $result
}

function Write-Marker($dest) {
  $content = @(
    "version=$Version",
    "source=$RepoRoot",
    "installed_at=$Stamp",
    "agent=$Agent",
    "scope=$Scope"
  ) -join "`n"
  if ($DryRun) { Write-Say "  [dry-run] write $dest\$Marker" }
  else { Set-Content -Path (Join-Path $dest $Marker) -Value $content -Encoding UTF8 }
}

function Install-Skill($dest) {
  Write-Say "Skill -> $dest"
  if ((Test-Path $dest) -and -not (Test-Path (Join-Path $dest $Marker)) -and -not $Force) {
    Write-Say "  Refusing to overwrite an unmarked directory: $dest"
    Write-Say "  Re-run with -Force after reviewing it."
    return
  }
  if (Test-Path $dest) {
    Invoke-Step "remove $dest" { Remove-Item $dest -Recurse -Force }
  }
  Invoke-Step "create $dest" { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
  if ($Link) {
    if ($DryRun) { Write-Say "  [dry-run] symlink $SkillSrc -> $dest" }
    else {
      try { New-Item -ItemType SymbolicLink -Path $dest -Target $SkillSrc -Force | Out-Null }
      catch {
        Write-Say "  Symlink not permitted; copying instead."
        Copy-Item -Path (Join-Path $SkillSrc "*") -Destination $dest -Recurse -Force
      }
    }
  } else {
    Invoke-Step "copy skill payload" { Copy-Item -Path (Join-Path $SkillSrc "*") -Destination $dest -Recurse -Force }
  }
  if (-not $Link) { Write-Marker $dest }
}

function Install-ManagedFile($dest, $source, $label) {
  if (-not $dest) { return }
  if ((Test-Path $dest) -and -not $Force) {
    $text = Get-Content $dest -Raw -ErrorAction SilentlyContinue
    if ($text -notmatch "bureau-managed") {
      Write-Say "  $label exists and is not BUREAU-managed: $dest (skipped; use -Force)"
      return
    }
  }
  Write-Say "$label -> $dest"
  Invoke-Step "copy $source -> $dest" {
    New-Item -ItemType Directory -Path (Split-Path -Parent $dest) -Force | Out-Null
    Copy-Item -Path $source -Destination $dest -Force
  }
}

function Uninstall-Skill($dest) {
  if (-not (Test-Path $dest)) { Write-Say "Not installed: $dest"; return }
  $item = Get-Item $dest -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    Write-Say "Remove symlink -> $dest"
    Invoke-Step "remove $dest" { Remove-Item $dest -Force }
    return
  }
  if (-not (Test-Path (Join-Path $dest $Marker)) -and -not $Force) {
    Write-Say "Refusing to remove unmarked directory: $dest (use -Force after review)"
    return
  }
  Write-Say "Remove -> $dest"
  Invoke-Step "remove $dest" { Remove-Item $dest -Recurse -Force }
}

function Uninstall-ManagedFile($dest) {
  if (-not $dest -or -not (Test-Path $dest)) { return }
  $text = Get-Content $dest -Raw -ErrorAction SilentlyContinue
  if ($text -notmatch "bureau-managed" -and -not $Force) {
    Write-Say "Refusing to remove unmarked file: $dest"
    return
  }
  Write-Say "Remove -> $dest"
  Invoke-Step "remove $dest" { Remove-Item $dest -Force }
}

function Install-AgentsBlock {
  if (-not ($WithAgents -and $Scope -eq "project" -and $Agent -eq "codex")) { return }
  $file = Join-Path $ProjectRoot "AGENTS.md"
  $existing = if (Test-Path $file) { Get-Content $file -Raw } else { "" }
  if ($existing -match "<!-- bureau:start -->") { Write-Say "AGENTS.md already contains the BUREAU block."; return }
  Write-Say "AGENTS.md -> $file"
  Invoke-Step "append Codex AGENTS.md block" {
    Add-Content -Path $file -Value "`n$((Get-Content (Join-Path $RepoRoot 'installers\codex\AGENTS.snippet.md') -Raw))`n"
  }
}

function Do-Agent($targetAgent) {
  $targets = Get-Targets $targetAgent
  Write-Say ""
  Write-Say "--- $targetAgent ($Scope) ------------------------------"
  if ($Uninstall) {
    Uninstall-Skill $targets.Skill
    Uninstall-ManagedFile $targets.Command
    Uninstall-ManagedFile $targets.Rule
    return
  }
  Install-Skill $targets.Skill
  if (-not $NoCommand -and $targets.Command) {
    Install-ManagedFile $targets.Command (Join-Path $RepoRoot "installers\claude\commands\bureau.md") "Command"
  }
  if ($targets.Rule) {
    Install-ManagedFile $targets.Rule (Join-Path $RepoRoot "installers\antigravity\rules\bureau.md") "Rule"
  }
}

$mode = if ($Uninstall) { "uninstall" } else { "install" }
Write-Say "BUREAU $Version - $mode ($Scope)"
Write-Say "Source: $SkillSrc"
if ($Link) { Write-Say "Mode: symlink (development)" }
if ($DryRun) { Write-Say "Mode: dry-run (nothing will change)" }

if ($Agent -eq "all") {
  foreach ($a in @("claude", "codex", "antigravity", "hermes")) { Do-Agent $a }
} else {
  Do-Agent $Agent
}
Install-AgentsBlock

Write-Say ""
if ($Uninstall) { Write-Say "Done. Restart the host agent to refresh its skill index." }
else {
  Write-Say "Done. Restart the host agent, then run /bureau (or ask for a design)."
  Write-Say "Verify: node `"$SkillSrc\scripts\doctor.mjs`""
}
