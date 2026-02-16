import { App } from '@/types/app';

export const coreMediaApps: App[] = [
  {
    id: 'vlc',
    name: 'VLC Media Player',
    description: 'Free, open-source media player that plays almost everything',
    category: 'media',
    icon: '/icons/vlc.svg',
    website: 'https://videolan.org',
    sourceUrl: 'https://videolan.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id VideoLAN.VLC --accept-source-agreements --accept-package-agreements',
        packageName: 'VideoLAN.VLC',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask vlc',
        packageName: 'vlc',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install vlc',
        packageName: 'vlc',
      },
    },
    size: 55,
    popularity: 90,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Music streaming service',
    category: 'media',
    icon: '/icons/spotify.svg',
    website: 'https://spotify.com',
    sourceUrl: 'https://spotify.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Spotify.Spotify --accept-source-agreements --accept-package-agreements',
        packageName: 'Spotify.Spotify',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask spotify',
        packageName: 'spotify',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install spotify',
        packageName: 'spotify',
      },
    },
    size: 150,
    popularity: 92,
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Knowledge base app that works on local Markdown files',
    category: 'media',
    icon: '/icons/obsidian.svg',
    website: 'https://obsidian.md',
    sourceUrl: 'https://obsidian.md',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Obsidian.Obsidian --accept-source-agreements --accept-package-agreements',
        packageName: 'Obsidian.Obsidian',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask obsidian',
        packageName: 'obsidian',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install obsidian',
        packageName: 'obsidian',
      },
    },
    size: 120,
    popularity: 85,
  },
];
