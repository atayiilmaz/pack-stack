import { Platform } from '@/types/app';

export type OSOption =
  | 'windows'
  | 'macos'
  | 'linux';

export type LinuxDistro = 'ubuntu' | 'arch' | 'debian' | 'fedora';

export interface OSSelect {
  id: OSOption | LinuxDistro;
  name: string;
  icon: string;
  color: string;
  description: string;
  command: string;
  parent?: OSOption;
}

export const osOptions: OSSelect[] = [
  {
    id: 'windows' as const,
    name: 'Windows',
    icon: '/icons/windows.png',
    color: '#0078D4',
    description: 'Winget package manager',
    command: 'winget install'
  },
  {
    id: 'macos' as const,
    name: 'macOS',
    icon: '/icons/macos.png',
    color: '#000000',
    description: 'Homebrew package manager',
    command: 'brew install'
  },
  {
    id: 'linux' as const,
    name: 'Linux',
    icon: '/icons/linux.png',
    color: '#DD4814',
    description: 'Select your distribution',
    command: 'Select distro'
  },
];

export const linuxDistros: OSSelect[] = [
  {
    id: 'ubuntu' as const,
    name: 'Ubuntu',
    icon: '/icons/ubuntu.png',
    color: '#E95420',
    description: 'APT package manager',
    command: 'sudo apt install',
    parent: 'linux' as const,
  },
  {
    id: 'arch' as const,
    name: 'Arch Linux',
    icon: '/icons/arch.png',
    color: '#1793D1',
    description: 'Pacman package manager',
    command: 'sudo pacman -S',
    parent: 'linux' as const,
  },
  {
    id: 'debian' as const,
    name: 'Debian',
    icon: '/icons/debian.png',
    color: '#D70A53',
    description: 'APT package manager',
    command: 'sudo apt install',
    parent: 'linux' as const,
  },
  {
    id: 'fedora' as const,
    name: 'Fedora',
    icon: '/icons/fedora.svg',
    color: '#294172',
    description: 'DNF package manager',
    command: 'sudo dnf install',
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

export function getOSInfo(osId: string): OSSelect | undefined {
  return [...osOptions, ...linuxDistros].find(os => os.id === osId);
}
