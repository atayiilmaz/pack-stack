import { Platform } from '@/types/app';

export type OSOption =
  | 'windows'
  | 'macos'
  | 'linux';

export type LinuxDistro = 'ubuntu' | 'arch' | 'debian' | 'fedora' | 'opensuse';

export interface OSSelect {
  id: OSOption | LinuxDistro;
  name: string;
  icon: string;
  parent?: OSOption;
}

export const osOptions: OSSelect[] = [
  {
    id: 'windows' as const,
    name: 'Windows',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_%282012%29.svg',
  },
  {
    id: 'macos' as const,
    name: 'macOS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Apple_logo_2016.svg',
  },
  {
    id: 'linux' as const,
    name: 'Linux',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg',
  },
];

export const linuxDistros: OSSelect[] = [
  {
    id: 'ubuntu' as const,
    name: 'Ubuntu',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Ubuntu-logo_no_wordmark.svg',
    parent: 'linux' as const,
  },
  {
    id: 'arch' as const,
    name: 'Arch Linux',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Arch_Linux_logo.svg',
    parent: 'linux' as const,
  },
  {
    id: 'debian' as const,
    name: 'Debian',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Debian-OpenLogo.svg',
    parent: 'linux' as const,
  },
  {
    id: 'fedora' as const,
    name: 'Fedora',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Fedora_logo.svg',
    parent: 'linux' as const,
  },
];

export function getInstallMethodForOS(osId: string): string {
  switch (osId) {
    case 'windows':
      return 'winget';
    case 'macos':
      return 'brew';
    case 'ubuntu':
    case 'debian':
      return 'apt';
    case 'arch':
      return 'pacman';
    case 'fedora':
      return 'dnf';
    default:
      return 'apt';
  }
}
