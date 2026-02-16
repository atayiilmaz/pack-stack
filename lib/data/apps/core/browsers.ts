import { App } from '@/types/app';

export const coreBrowsersApps: App[] = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    description: 'Fast, secure web browser from Google',
    category: 'browsers',
    icon: '/icons/chrome.svg',
    website: 'https://chrome.google.com',
    sourceUrl: 'https://chrome.google.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Google.Chrome --accept-source-agreements --accept-package-agreements',
        packageName: 'Google.Chrome',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask google-chrome',
        packageName: 'google-chrome',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install google-chrome',
        packageName: 'google-chrome',
      },
    },
    size: 100,
    popularity: 100,
  },
  {
    id: 'firefox',
    name: 'Mozilla Firefox',
    description: 'Free, open-source web browser',
    category: 'browsers',
    icon: '/icons/firefox.svg',
    website: 'https://firefox.com',
    sourceUrl: 'https://firefox.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Mozilla.Firefox --accept-source-agreements --accept-package-agreements',
        packageName: 'Mozilla.Firefox',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask firefox',
        packageName: 'firefox',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install firefox',
        packageName: 'firefox',
      },
    },
    size: 80,
    popularity: 95,
  },
  {
    id: 'brave',
    name: 'Brave Browser',
    description: 'Privacy-focused web browser with built-in ad blocking',
    category: 'browsers',
    icon: '/icons/brave.svg',
    website: 'https://brave.com',
    sourceUrl: 'https://brave.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Brave.Brave --accept-source-agreements --accept-package-agreements',
        packageName: 'Brave.Brave',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask brave-browser',
        packageName: 'brave-browser',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install brave',
        packageName: 'brave',
      },
    },
    size: 110,
    popularity: 75,
  },
];
