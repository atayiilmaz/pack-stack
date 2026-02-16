import { App } from '@/types/app';

export const coreDesignApps: App[] = [
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
