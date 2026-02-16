import { App, Platform } from '@/types/app';

export function generateCommand(apps: App[], platform: Platform): string {
  const commands = apps
    .map((app) => app.platforms[platform]?.command)
    .filter(Boolean);

  if (commands.length === 0) return '';

  return commands.join(' && ');
}

export function generateScriptContent(apps: App[], platform: Platform): string {
  const commands = apps
    .map((app) => app.platforms[platform]?.command)
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

    case 'linux':
      return `#!/bin/bash
echo "Installing ${apps.length} apps..."
echo ""
${commands.join('\n')}
echo ""
echo "Done!"`;

    default:
      return '';
  }
}

export function downloadScript(apps: App[], platform: Platform): void {
  const content = generateScriptContent(apps, platform);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = platform === 'windows' ? 'install.bat' : 'install.sh';
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
