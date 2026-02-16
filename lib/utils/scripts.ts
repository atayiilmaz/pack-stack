import { App, Platform } from '@/types/app';

/**
 * Get the appropriate install command for an app based on platform/distro
 */
function getInstallCommand(app: App, platform: Platform): string {
  // For Linux distros, try distro-specific first, then fall back to generic linux
  if (platform === 'ubuntu' || platform === 'debian' || platform === 'arch' || platform === 'fedora') {
    return app.platforms[platform]?.command || app.platforms.linux?.command || '';
  }
  return app.platforms[platform]?.command || '';
}

/**
 * Get package manager for a platform
 */
function getPackageManager(platform: Platform): string {
  switch (platform) {
    case 'windows': return 'winget';
    case 'macos': return 'brew';
    case 'ubuntu':
    case 'debian': return 'apt';
    case 'arch': return 'pacman';
    case 'fedora': return 'dnf';
    case 'linux': return 'apt';
    default: return 'apt';
  }
}

/**
 * Generate a one-line command for running all installs sequentially
 */
export function generateCommand(apps: App[], platform: Platform): string {
  const commands = apps
    .map((app) => getInstallCommand(app, platform))
    .filter(Boolean);

  if (commands.length === 0) return '';

  return commands.join(' && ');
}

/**
 * Get the file extension for installation scripts
 * Windows uses PowerShell (.ps1) for better error handling and features
 */
export function getScriptExtension(platform: Platform): string {
  if (platform === 'windows') return '.ps1';
  return '.sh';
}

/**
 * Get the filename for the installation script
 */
export function getScriptName(platform: Platform): string {
  if (platform === 'windows') return 'install.ps1';
  if (platform === 'macos') return 'install-macos.sh';
  if (platform === 'ubuntu') return 'install-ubuntu.sh';
  if (platform === 'arch') return 'install-arch.sh';
  if (platform === 'debian') return 'install-debian.sh';
  if (platform === 'fedora') return 'install-fedora.sh';
  return 'install.sh';
}

/**
 * Get timestamp for script generation
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Escape dollar signs in bash scripts to prevent TypeScript template literal interpretation
 */
function escapeBashVars(str: string): string {
  return str.replace(/\$/g, '\\$');
}

/**
 * Generate Windows PowerShell installation script
 * Features:
 * - Winget availability check with Microsoft Store prompt
 * - Error handling for each package
 * - Administrator check (non-blocking)
 * - Verbose output and progress
 * - Idempotent (safe to run multiple times)
 */
function generateWindowsScript(apps: App[]): string {
  const commands = apps
    .map((app) => getInstallCommand(app, 'windows'))
    .filter(Boolean);

  // Extract package IDs for verification (e.g., 'winget install --id Google.Chrome' -> 'Google.Chrome')
  const packageIds = commands.map(cmd => {
    const match = cmd.match(/--id\s+(\S+)/);
    return match ? match[1] : cmd.match(/winget\s+install\s+(\S+)/)?.[1] || '';
  }).filter(Boolean);

  const packagesList = packageIds.map(id => `'${id}'`).join(', ');

  return `# PackStack Installation Script for Windows
# Generated on ${getTimestamp()}
# This script is idempotent and safe to run multiple times

$ErrorActionPreference = "Continue"

# Administrator check
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "This script is not running as Administrator. Some installations may require elevation."
    Write-Host "If installations fail, right-click and run 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PackStack Windows Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Preparing to install ${apps.length} package(s)..." -ForegroundColor Green
Write-Host ""

# Check for winget
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Warning "Windows Package Manager (winget) is not installed."
    Write-Host ""
    Write-Host " winget is required to install packages automatically." -ForegroundColor Yellow
    Write-Host " Please install 'App Installer' from the Microsoft Store." -ForegroundColor Yellow
    Write-Host ""
    Write-Host " Opening Microsoft Store..." -ForegroundColor Cyan
    Start-Process ms-windows-store://pdp/?productid=9NBLGGH4NNS1
    Write-Host ""
    Write-Host " After installing App Installer, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Windows Package Manager found: $((winget --version).Trim())" -ForegroundColor Green
Write-Host ""

# Update winget source
Write-Host "Updating package sources..." -ForegroundColor Cyan
winget source update --include-unknown | Out-Null
Write-Host "Package sources updated." -ForegroundColor Green
Write-Host ""

# Track installation results
$successCount = 0
$failedCount = 0
$failedPackages = @()

# Install packages
$packages = @(${packagesList})
$currentIndex = 0

foreach ($pkg in $packages) {
    $currentIndex++
    Write-Host "[$currentIndex/$($packages.Count)] Installing: $pkg" -ForegroundColor Cyan

    try {
        $result = winget install --id $pkg --accept-package-agreements --accept-source-agreements -e --silent 2>&1

        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 0x0) {
            Write-Host "  Successfully installed: $pkg" -ForegroundColor Green
            $successCount++
        } elseif ($LASTEXITCODE -eq 0x57) {
            Write-Host "  Already installed (skipped): $pkg" -ForegroundColor Yellow
            $successCount++
        } else {
            Write-Host "  Installation returned code: $LASTEXITCODE" -ForegroundColor Yellow
            # Check if actually installed despite error code
            $installed = winget list --id $pkg -e 2>$null
            if ($installed) {
                Write-Host "  Verified as installed: $pkg" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "  Failed to install: $pkg" -ForegroundColor Red
                $failedPackages += $pkg
                $failedCount++
            }
        }
    } catch {
        Write-Host "  Error installing $pkg: $($_.Exception.Message)" -ForegroundColor Red
        $failedPackages += $pkg
        $failedCount++
    }

    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Successfully installed: $successCount" -ForegroundColor Green
if ($failedCount -gt 0) {
    Write-Host "Failed installations: $failedCount" -ForegroundColor Red
    Write-Host ""
    Write-Host "Failed packages:" -ForegroundColor Red
    $failedPackages | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}
Write-Host ""

if ($failedCount -eq 0) {
    Write-Host "All packages installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Some packages failed to install. Please check the errors above." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
`;
}

/**
 * Generate macOS bash installation script
 * Features:
 * - Homebrew check with auto-install
 * - Verification for each package
 * - Idempotent
 */
function generateMacOsScript(apps: App[]): string {
  const commands = apps
    .map((app) => getInstallCommand(app, 'macos'))
    .filter(Boolean);

  // Categorize commands into cask and regular brew installs
  const caskCommands = commands.filter(cmd => cmd.includes('--cask'));
  const regularCommands = commands.filter(cmd => !cmd.includes('--cask'));

  // Extract package names
  const caskPackages = caskCommands.map(cmd => {
    const match = cmd.match(/brew\s+install\s+(?:--cask\s+)?(\S+)/);
    return match ? match[1] : '';
  }).filter(Boolean);

  const regularPackages = regularCommands.map(cmd => {
    const match = cmd.match(/brew\s+install\s+(\S+)/);
    return match ? match[1] : '';
  }).filter(Boolean);

  // Build the cask installation section
  let caskSection = '';
  if (caskPackages.length > 0) {
    const pkgList = caskPackages.map(pkg => `'${pkg}'`).join(' ');
    caskSection = `
cask_packages=(${pkgList})
for pkg in "\${cask_packages[@]}"; do
    current_index=\$((current_index + 1))
    echo "\${CYAN}[\$current_index/\$total_count] Installing: \$pkg\${NC}"

    if brew list --cask "\$pkg" &> /dev/null; then
        echo "\${YELLOW}  Already installed (skipped): \$pkg\${NC}"
        success_count=\$((success_count + 1))
    else
        if brew install --cask "\$pkg" 2>&1; then
            echo "\${GREEN}  Successfully installed: \$pkg\${NC}"
            success_count=\$((success_count + 1))
        else
            echo "\${RED}  Failed to install: \$pkg\${NC}"
            failed_packages+=("\$pkg")
            failed_count=\$((failed_count + 1))
        fi
    fi
    echo ""
done
`;
  } else {
    caskSection = '\n# No cask packages selected\n';
  }

  // Build the regular brew installation section
  let regularSection = '';
  if (regularPackages.length > 0) {
    const pkgList = regularPackages.map(pkg => `'${pkg}'`).join(' ');
    regularSection = `
regular_packages=(${pkgList})
for pkg in "\${regular_packages[@]}"; do
    current_index=\$((current_index + 1))
    echo "\${CYAN}[\$current_index/\$total_count] Installing: \$pkg\${NC}"

    if brew list "\$pkg" &> /dev/null; then
        echo "\${YELLOW}  Already installed (skipped): \$pkg\${NC}"
        success_count=\$((success_count + 1))
    else
        if brew install "\$pkg" 2>&1; then
            echo "\${GREEN}  Successfully installed: \$pkg\${NC}"
            success_count=\$((success_count + 1))
        else
            echo "\${RED}  Failed to install: \$pkg\${NC}"
            failed_packages+=("\$pkg")
            failed_count=\$((failed_count + 1))
        fi
    fi
    echo ""
done
`;
  } else {
    regularSection = '\n# No regular packages selected\n';
  }

  return `#!/bin/bash
# PackStack Installation Script for macOS
# Generated on ${getTimestamp()}
# This script is idempotent and safe to run multiple times

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo ""
echo "========================================"
echo "  PackStack macOS Installer"
echo "========================================"
echo ""
echo "Preparing to install ${apps.length} package(s)..."
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "\${YELLOW}Homebrew is not installed.\${NC}"
    echo ""
    echo "Homebrew is required to install packages automatically."
    echo "Installing Homebrew..."
    echo ""
    /bin/bash -c "\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Check for Apple Silicon and set up PATH
    if [[ \$(uname -m) == 'arm64' ]]; then
        echo 'eval "\$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "\$(/opt/homebrew/bin/brew shellenv)"
    fi

    echo ""
    echo "\${GREEN}Homebrew installed successfully!\${NC}"
else
    echo "\${GREEN}Homebrew found: \$(brew --version | head -n1)\${NC}"
fi

echo ""
echo "\${CYAN}Updating Homebrew...\${NC}"
brew update > /dev/null 2>&1
echo "\${GREEN}Homebrew updated.\${NC}"
echo ""

# Track installation results
success_count=0
failed_count=0
failed_packages=()

total_count=\$((\$${caskPackages.length} + \$${regularPackages.length}))
current_index=0

# Install casks
${caskSection}

# Install regular brew packages
${regularSection}

# Summary
echo "========================================"
echo "  Installation Summary"
echo "========================================"
echo ""
echo "\${GREEN}Successfully installed: \$success_count\${NC}"
if [ \$failed_count -gt 0 ]; then
    echo "\${RED}Failed installations: \$failed_count\${NC}"
    echo ""
    echo "Failed packages:"
    for pkg in "\${failed_packages[@]}"; do
        echo "\${RED}  - \$pkg\${NC}"
    done
fi
echo ""

if [ \$failed_count -eq 0 ]; then
    echo "\${GREEN}All packages installed successfully!\${NC}"
else
    echo "\${YELLOW}Some packages failed to install. Please check the errors above.\${NC}"
fi

echo ""
`;
}

/**
 * Generate Ubuntu/Debian bash installation script
 * Features:
 * - apt update before installs
 * - Verification with dpkg
 * - Idempotent
 */
function generateDebianScript(apps: App[], platform: 'ubuntu' | 'debian'): string {
  const commands = apps
    .map((app) => getInstallCommand(app, platform))
    .filter(Boolean);

  // Extract package names
  const packages = commands.map(cmd => {
    const match = cmd.match(/apt\s+install\s+(?:-y\s+)?(\S+(?:\s+\S+)*)/);
    return match ? match[1].trim() : '';
  }).filter(Boolean);

  const pkgList = packages.map(pkg => `'${pkg}'`).join(' ');

  return `#!/bin/bash
# PackStack Installation Script for ${platform === 'ubuntu' ? 'Ubuntu' : 'Debian'}
# Generated on ${getTimestamp()}
# This script is idempotent and safe to run multiple times

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo ""
echo "========================================"
echo "  PackStack ${platform === 'ubuntu' ? 'Ubuntu' : 'Debian'} Installer"
echo "========================================"
echo ""
echo "Preparing to install ${apps.length} package(s)..."
echo ""

# Update package list
echo "\${CYAN}Updating package list...\${NC}"
sudo apt update -qq
echo "\${GREEN}Package list updated.\${NC}"
echo ""

# Track installation results
success_count=0
failed_count=0
failed_packages=()

packages=(${pkgList})
total_count=\${#packages[@]}

for pkg in "\${packages[@]}"; do
    index=\$((index + 1))
    echo "\${CYAN}[\$index/\$total_count] Installing: \$pkg\${NC}"

    if dpkg -l "\$pkg" &> /dev/null; then
        echo "\${YELLOW}  Already installed (skipped): \$pkg\${NC}"
        success_count=\$((success_count + 1))
    else
        if sudo apt install -y "\$pkg" 2>&1; then
            # Verify installation
            if dpkg -l "\$pkg" &> /dev/null; then
                echo "\${GREEN}  Successfully installed: \$pkg\${NC}"
                success_count=\$((success_count + 1))
            else
                echo "\${RED}  Installation completed but package not found: \$pkg\${NC}"
                failed_packages+=("\$pkg")
                failed_count=\$((failed_count + 1))
            fi
        else
            echo "\${RED}  Failed to install: \$pkg\${NC}"
            failed_packages+=("\$pkg")
            failed_count=\$((failed_count + 1))
        fi
    fi
    echo ""
done

# Summary
echo "========================================"
echo "  Installation Summary"
echo "========================================"
echo ""
echo "\${GREEN}Successfully installed: \$success_count\${NC}"
if [ \$failed_count -gt 0 ]; then
    echo "\${RED}Failed installations: \$failed_count\${NC}"
    echo ""
    echo "Failed packages:"
    for pkg in "\${failed_packages[@]}"; do
        echo "\${RED}  - \$pkg\${NC}"
    done
fi
echo ""

if [ \$failed_count -eq 0 ]; then
    echo "\${GREEN}All packages installed successfully!\${NC}"
else
    echo "\${YELLOW}Some packages failed to install. Please check the errors above.\${NC}"
fi

echo ""
`;
}

/**
 * Generate Arch Linux bash installation script
 * Features:
 * - AUR helper detection (paru/yay)
 * - Auto-install yay if neither present
 * - Use AUR helper for AUR packages
 * - Verification with pacman
 * - Idempotent
 */
function generateArchScript(apps: App[]): string {
  const commands = apps
    .map((app) => getInstallCommand(app, 'arch'))
    .filter(Boolean);

  // Extract package names
  const packages = commands.map(cmd => {
    const match = cmd.match(/pacman\s+-S\s+(?:--needed\s+)?(\S+(?:\s+\S+)*)/);
    return match ? match[1].trim() : '';
  }).filter(Boolean);

  const pkgList = packages.map(pkg => `'${pkg}'`).join(' ');

  return `#!/bin/bash
# PackStack Installation Script for Arch Linux
# Generated on ${getTimestamp()}
# This script is idempotent and safe to run multiple times

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo ""
echo "========================================"
echo "  PackStack Arch Linux Installer"
echo "========================================"
echo ""
echo "Preparing to install ${apps.length} package(s)..."
echo ""

# Update package database
echo "\${CYAN}Updating package database...\${NC}"
sudo pacman -Sy --noconfirm > /dev/null 2>&1
echo "\${GREEN}Package database updated.\${NC}"
echo ""

# Check for AUR helper
aur_helper=""
if command -v paru &> /dev/null; then
    aur_helper="paru"
    echo "\${GREEN}Found AUR helper: paru\${NC}"
elif command -v yay &> /dev/null; then
    aur_helper="yay"
    echo "\${GREEN}Found AUR helper: yay\${NC}"
else
    echo "\${YELLOW}No AUR helper found (paru or yay).\${NC}"
    echo ""
    echo "AUR helpers are recommended for installing AUR packages."
    echo "Installing yay (AUR helper)..."
    echo ""

    # Install yay
    sudo pacman -S --noconfirm --needed base-devel git > /dev/null 2>&1
    temp_dir=\$(mktemp -d)
    cd "\$temp_dir"
    git clone https://aur.archlinux.org/yay.git > /dev/null 2>&1
    cd yay
    makepkg -si --noconfirm > /dev/null 2>&1
    cd - > /dev/null
    rm -rf "\$temp_dir"

    aur_helper="yay"
    echo "\${GREEN}yay installed successfully!\${NC}"
    echo ""
fi

# Track installation results
success_count=0
failed_count=0
failed_packages=()

packages=(${pkgList})
total_count=\${#packages[@]}

for pkg in "\${packages[@]}"; do
    index=\$((index + 1))
    echo "\${CYAN}[\$index/\$total_count] Installing: \$pkg\${NC}"

    if pacman -Qi "\$pkg" &> /dev/null; then
        echo "\${YELLOW}  Already installed (skipped): \$pkg\${NC}"
        success_count=\$((success_count + 1))
    else
        # Try pacman first (official repo)
        if sudo pacman -S --needed --noconfirm "\$pkg" 2>&1; then
            if pacman -Qi "\$pkg" &> /dev/null; then
                echo "\${GREEN}  Successfully installed: \$pkg\${NC}"
                success_count=\$((success_count + 1))
            else
                echo "\${RED}  Installation completed but package not found: \$pkg\${NC}"
                failed_packages+=("\$pkg")
                failed_count=\$((failed_count + 1))
            fi
        else
            # Try AUR helper as fallback
            if \$aur_helper -S --noconfirm "\$pkg" 2>&1; then
                if pacman -Qi "\$pkg" &> /dev/null; then
                    echo "\${GREEN}  Successfully installed (from AUR): \$pkg\${NC}"
                    success_count=\$((success_count + 1))
                else
                    echo "\${RED}  Installation completed but package not found: \$pkg\${NC}"
                    failed_packages+=("\$pkg")
                    failed_count=\$((failed_count + 1))
                fi
            else
                echo "\${RED}  Failed to install: \$pkg\${NC}"
                echo "\${YELLOW}  Note: Package may need to be installed manually\${NC}"
                failed_packages+=("\$pkg")
                failed_count=\$((failed_count + 1))
            fi
        fi
    fi
    echo ""
done

# Summary
echo "========================================"
echo "  Installation Summary"
echo "========================================"
echo ""
echo "\${GREEN}Successfully installed: \$success_count\${NC}"
if [ \$failed_count -gt 0 ]; then
    echo "\${RED}Failed installations: \$failed_count\${NC}"
    echo ""
    echo "Failed packages:"
    for pkg in "\${failed_packages[@]}"; do
        echo "\${RED}  - \$pkg\${NC}"
    done
fi
echo ""

if [ \$failed_count -eq 0 ]; then
    echo "\${GREEN}All packages installed successfully!\${NC}"
else
    echo "\${YELLOW}Some packages failed to install. Please check the errors above.\${NC}"
fi

echo ""
`;
}

/**
 * Generate Fedora bash installation script
 * Features:
 * - dnf check-update before installs
 * - Verification with rpm
 * - Idempotent
 */
function generateFedoraScript(apps: App[]): string {
  const commands = apps
    .map((app) => getInstallCommand(app, 'fedora'))
    .filter(Boolean);

  // Extract package names
  const packages = commands.map(cmd => {
    const match = cmd.match(/dnf\s+install\s+(?:-y\s+)?(\S+(?:\s+\S+)*)/);
    return match ? match[1].trim() : '';
  }).filter(Boolean);

  const pkgList = packages.map(pkg => `'${pkg}'`).join(' ');

  return `#!/bin/bash
# PackStack Installation Script for Fedora
# Generated on ${getTimestamp()}
# This script is idempotent and safe to run multiple times

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo ""
echo "========================================"
echo "  PackStack Fedora Installer"
echo "========================================"
echo ""
echo "Preparing to install ${apps.length} package(s)..."
echo ""

# Check package updates
echo "\${CYAN}Checking for package updates...\${NC}"
sudo dnf check-update --assumeno > /dev/null 2>&1 || true
echo "\${GREEN}Package check complete.\${NC}"
echo ""

# Track installation results
success_count=0
failed_count=0
failed_packages=()

packages=(${pkgList})
total_count=\${#packages[@]}

for pkg in "\${packages[@]}"; do
    index=\$((index + 1))
    echo "\${CYAN}[\$index/\$total_count] Installing: \$pkg\${NC}"

    if rpm -q "\$pkg" &> /dev/null; then
        echo "\${YELLOW}  Already installed (skipped): \$pkg\${NC}"
        success_count=\$((success_count + 1))
    else
        if sudo dnf install -y "\$pkg" 2>&1; then
            # Verify installation
            if rpm -q "\$pkg" &> /dev/null; then
                echo "\${GREEN}  Successfully installed: \$pkg\${NC}"
                success_count=\$((success_count + 1))
            else
                echo "\${RED}  Installation completed but package not found: \$pkg\${NC}"
                failed_packages+=("\$pkg")
                failed_count=\$((failed_count + 1))
            fi
        else
            echo "\${RED}  Failed to install: \$pkg\${NC}"
            failed_packages+=("\$pkg")
            failed_count=\$((failed_count + 1))
        fi
    fi
    echo ""
done

# Summary
echo "========================================"
echo "  Installation Summary"
echo "========================================"
echo ""
echo "\${GREEN}Successfully installed: \$success_count\${NC}"
if [ \$failed_count -gt 0 ]; then
    echo "\${RED}Failed installations: \$failed_count\${NC}"
    echo ""
    echo "Failed packages:"
    for pkg in "\${failed_packages[@]}"; do
        echo "\${RED}  - \$pkg\${NC}"
    done
fi
echo ""

if [ \$failed_count -eq 0 ]; then
    echo "\${GREEN}All packages installed successfully!\${NC}"
else
    echo "\${YELLOW}Some packages failed to install. Please check the errors above.\${NC}"
fi

echo ""
`;
}

/**
 * Generate installation script content based on platform
 * This is the main entry point for script generation
 */
export function generateScriptContent(apps: App[], platform: Platform): string {
  if (apps.length === 0) {
    return '# No apps selected for installation\n';
  }

  switch (platform) {
    case 'windows':
      return generateWindowsScript(apps);

    case 'macos':
      return generateMacOsScript(apps);

    case 'ubuntu':
      return generateDebianScript(apps, 'ubuntu');

    case 'debian':
      return generateDebianScript(apps, 'debian');

    case 'arch':
      return generateArchScript(apps);

    case 'fedora':
      return generateFedoraScript(apps);

    case 'linux':
    default:
      // Generic linux - use debian style as fallback
      return generateDebianScript(apps, 'ubuntu');
  }
}

/**
 * Download the installation script as a file
 */
export function downloadScript(apps: App[], platform: Platform): void {
  const content = generateScriptContent(apps, platform);

  // Set appropriate MIME type based on platform
  const mimeType = platform === 'windows'
    ? 'text/plain'
    : 'application/x-sh';

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = getScriptName(platform);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculate total download size for apps
 */
export function getTotalSize(apps: App[]): number {
  return apps.reduce((total, app) => total + (app.size || 0), 0);
}

/**
 * Format bytes to human readable size
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} MB`;
  return `${(bytes / 1024).toFixed(1)} GB`;
}

/**
 * Get display name for platform
 */
export function getPlatformDisplayName(platform: Platform): string {
  switch (platform) {
    case 'windows': return 'Windows';
    case 'macos': return 'macOS';
    case 'ubuntu': return 'Ubuntu';
    case 'arch': return 'Arch Linux';
    case 'debian': return 'Debian';
    case 'fedora': return 'Fedora';
    case 'linux': return 'Linux';
    default: return platform;
  }
}
