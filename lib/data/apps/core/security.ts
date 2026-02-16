import { App } from '@/types/app';

export const coreSecurityApps: App[] = [
  {
    id: 'bitwarden',
    name: 'Bitwarden',
    description: 'Open-source password manager',
    category: 'security',
    icon: '/icons/bitwarden.svg',
    website: 'https://bitwarden.com',
    sourceUrl: 'https://bitwarden.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Bitwarden.Bitwarden --accept-source-agreements --accept-package-agreements',
        packageName: 'Bitwarden.Bitwarden',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask bitwarden',
        packageName: 'bitwarden',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install bitwarden',
        packageName: 'bitwarden',
      },
    },
    size: 60,
    popularity: 82,
  },
];
