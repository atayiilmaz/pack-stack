import { App } from '@/types/app';

export const coreDevelopmentApps: App[] = [
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
];
