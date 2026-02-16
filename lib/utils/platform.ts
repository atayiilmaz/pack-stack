import { Platform } from '@/types/app';

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'windows';

  const ua = window.navigator.userAgent;

  if (/Win/.test(ua)) return 'windows';
  if (/Mac/.test(ua)) return 'macos';
  if (/Linux/.test(ua)) return 'linux';

  return 'windows';
}

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case 'windows':
      return 'Windows';
    case 'macos':
      return 'macOS';
    case 'ubuntu':
      return 'Ubuntu';
    case 'arch':
      return 'Arch Linux';
    case 'debian':
      return 'Debian';
    case 'fedora':
      return 'Fedora';
    case 'linux':
      return 'Linux';
    default:
      return platform;
  }
}
