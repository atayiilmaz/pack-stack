import { App, Platform } from '@/types/app';

export function generateCommand(apps: App[], platform: Platform): string {
  const commands = apps
    .map((app) => {
      // For Linux distros, use linux command as fallback
      if (platform === 'ubuntu' || platform === 'arch' || platform === 'debian' || platform === 'fedora') {
        return app.platforms.linux?.command || '';
      }
      return app.platforms[platform]?.command || '';
    })
    .filter(Boolean);

  if (commands.length === 0) return '';

  return commands.join(' && ');
}

export function getScriptExtension(platform: Platform): string {
  if (platform === 'windows') return '.bat';
  return '.sh';
}

export function getScriptName(platform: Platform): string {
  if (platform === 'windows') return 'install.bat';
  if (platform === 'macos') return 'install-macos.sh';
  if (platform === 'ubuntu') return 'install-ubuntu.sh';
  if (platform === 'arch') return 'install-arch.sh';
  if (platform === 'debian') return 'install-debian.sh';
  if (platform === 'fedora') return 'install-fedora.sh';
  return 'install.sh';
}

export function generateScriptContent(apps: App[], platform: Platform): string {
  const commands = apps
    .map((app) => {
      // For Linux distros, use linux command as fallback
      if (platform === 'ubuntu' || platform === 'arch' || platform === 'debian' || platform === 'fedora') {
        return app.platforms.linux?.command || '';
      }
      return app.platforms[platform]?.command || '';
    })
    .filter(Boolean);

  switch (platform) {
    case 'windows':
      return `@echo off
echo Installing ${apps.length} apps...
echo.
${commands.join('\n')}
echo.
echo Done! Press any key to exit.
pause`;

    case 'macos':
      return `#!/bin/bash
echo "Installing ${apps.length} apps..."
echo ""
${commands.join('\n')}
echo ""
echo "Done!"`;

    case 'ubuntu':
    case 'arch':
    case 'debian':
    case 'fedora':
      return `#!/bin/bash
echo "Installing ${apps.length} apps..."
echo ""
echo "Updating package list..."
sudo apt update
echo ""
echo "Installing packages..."
${commands.map(cmd => cmd.replace('sudo ', '')).join('\n')}
echo ""
echo "Done!"`;

    case 'linux':
    default:
      return `#!/bin/bash
echo "Installing ${apps.length} apps..."
echo ""
${commands.join('\n')}
echo ""
echo "Done!"`;
  }
}

export function downloadScript(apps: App[], platform: Platform): void {
  const content = generateScriptContent(apps, platform);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = getScriptName(platform);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getTotalSize(apps: App[]): number {
  return apps.reduce((total, app) => total + (app.size || 0), 0);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} MB`;
  return `${(bytes / 1024).toFixed(1)} GB`;
}

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
