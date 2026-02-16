import { App } from '@/types/app';

export const categories = {
  browsers: { name: 'Web Browsers', icon: '🌐' },
  media: { name: 'Media & Entertainment', icon: '🎵' },
  development: { name: 'Development Tools', icon: '💻' },
  utilities: { name: 'Utilities', icon: '⚙️' },
  security: { name: 'Security & Privacy', icon: '🔒' },
  communication: { name: 'Communication', icon: '💬' },
  design: { name: 'Design & Creative', icon: '🎨' },
  gaming: { name: 'Gaming', icon: '🎮' },
} as const;

export const apps: App[] = [
  // Browsers
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

  // Media
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

  // Development
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: 'Code editor from Microsoft',
    category: 'development',
    icon: '/icons/vscode.svg',
    website: 'https://code.visualstudio.com',
    sourceUrl: 'https://code.visualstudio.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Microsoft.VisualStudioCode --accept-source-agreements --accept-package-agreements',
        packageName: 'Microsoft.VisualStudioCode',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask visual-studio-code',
        packageName: 'visual-studio-code',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install code --classic',
        packageName: 'code',
      },
    },
    size: 90,
    popularity: 100,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 engine',
    category: 'development',
    icon: '/icons/nodejs.svg',
    website: 'https://nodejs.org',
    sourceUrl: 'https://nodejs.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id OpenJS.NodeJS --accept-source-agreements --accept-package-agreements',
        packageName: 'OpenJS.NodeJS',
      },
      macos: {
        type: 'brew',
        command: 'brew install node',
        packageName: 'node',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install nodejs',
        packageName: 'nodejs',
      },
    },
    size: 35,
    popularity: 88,
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Distributed version control system',
    category: 'development',
    icon: '/icons/git.svg',
    website: 'https://git-scm.com',
    sourceUrl: 'https://git-scm.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Git.Git --accept-source-agreements --accept-package-agreements',
        packageName: 'Git.Git',
      },
      macos: {
        type: 'brew',
        command: 'brew install git',
        packageName: 'git',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install git',
        packageName: 'git',
      },
    },
    size: 50,
    popularity: 90,
  },
  {
    id: 'docker',
    name: 'Docker Desktop',
    description: 'Container management platform',
    category: 'development',
    icon: '/icons/docker.svg',
    website: 'https://docker.com',
    sourceUrl: 'https://docker.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements',
        packageName: 'Docker.DockerDesktop',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask docker',
        packageName: 'docker',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install docker.io',
        packageName: 'docker.io',
      },
    },
    size: 500,
    popularity: 80,
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Programming language and runtime',
    category: 'development',
    icon: '/icons/python.svg',
    website: 'https://python.org',
    sourceUrl: 'https://python.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements',
        packageName: 'Python.Python.3.12',
      },
      macos: {
        type: 'brew',
        command: 'brew install python',
        packageName: 'python',
      },
      linux: {
        type: 'apt',
        command: 'sudo apt install python3',
        packageName: 'python3',
      },
    },
    size: 30,
    popularity: 85,
  },

  // Utilities
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

  // Security
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

  // Communication
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

  // Design
  {
    id: 'figma',
    name: 'Figma',
    description: 'Collaborative design tool',
    category: 'design',
    icon: '/icons/figma.svg',
    website: 'https://figma.com',
    sourceUrl: 'https://figma.com',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id Figma.Figma --accept-source-agreements --accept-package-agreements',
        packageName: 'Figma.Figma',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask figma',
        packageName: 'figma',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install figma-linux --classic',
        packageName: 'figma-linux',
      },
    },
    size: 80,
    popularity: 88,
  },
  {
    id: 'blender',
    name: 'Blender',
    description: 'Free and open-source 3D creation suite',
    category: 'design',
    icon: '/icons/blender.svg',
    website: 'https://blender.org',
    sourceUrl: 'https://blender.org',
    platforms: {
      windows: {
        type: 'winget',
        command: 'winget install --id BlenderFoundation.Blender --accept-source-agreements --accept-package-agreements',
        packageName: 'BlenderFoundation.Blender',
      },
      macos: {
        type: 'brew',
        command: 'brew install --cask blender',
        packageName: 'blender',
      },
      linux: {
        type: 'snap',
        command: 'sudo snap install blender --classic',
        packageName: 'blender',
      },
    },
    size: 300,
    popularity: 70,
  },
];

export type Category = keyof typeof categories;
