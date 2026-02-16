import { App } from '@/types/app';

export const coreUtilitiesApps: App[] = [
  {
    id: '7zip',
    name: '7-Zip',
    description: 'File archive utility with high compression ratio',
    category: 'utilities',
    icon: '/icons/7zip.svg',
    website: 'https://7-zip.org',
    sourceUrl: 'https://7-zip.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id 7zip.7zip --accept-source-agreements --accept-package-agreements',
        packageName: '7zip.7zip',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install p7zip-full',
        packageName: 'p7zip-full',
      },
    },
    size: 2,
    popularity: 88,
  },
  {
    id: 'notepad++',
    name: 'Notepad++',
    description: 'Free source code editor for Windows',
    category: 'utilities',
    icon: '/icons/notepad-plus.svg',
    website: 'https://notepad-plus-plus.org',
    sourceUrl: 'https://notepad-plus-plus.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Notepad++.Notepad++ --accept-source-agreements --accept-package-agreements',
        packageName: 'Notepad++.Notepad++',
      },
    },
    size: 5,
    popularity: 75,
  },
];
