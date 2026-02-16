import { App } from '@/types/app';

export const coreCommunicationApps: App[] = [
  {
    id: 'discord',
    name: 'Discord',
    description: 'Voice, video, and text chat app',
    category: 'communication',
    icon: '/icons/discord.svg',
    website: 'https://discord.com',
    sourceUrl: 'https://discord.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Discord.Discord --accept-source-agreements --accept-package-agreements',
        packageName: 'Discord.Discord',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask discord',
        packageName: 'discord',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install discord',
        packageName: 'discord',
      },
    },
    size: 100,
    popularity: 92,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication platform',
    category: 'communication',
    icon: '/icons/slack.svg',
    website: 'https://slack.com',
    sourceUrl: 'https://slack.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Slack.Slack --accept-source-agreements --accept-package-agreements',
        packageName: 'Slack.Slack',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask slack',
        packageName: 'slack',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install slack --classic',
        packageName: 'slack',
      },
    },
    size: 120,
    popularity: 78,
  },
];
