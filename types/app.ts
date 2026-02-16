// App type definitions
export type Platform = 'windows' | 'macos' | 'linux' | 'ubuntu' | 'arch' | 'debian' | 'fedora';

export type InstallMethod =
  | 'winget'     // Windows Package Manager
  | 'choco'      // Chocolatey
  | 'brew'       // Homebrew Cask
  | 'apt'        // Debian/Ubuntu
  | 'snap'       // Snap Store
  | 'flatpak'    // Flatpak
  | 'pacman'     // Arch Linux
  | 'dnf'        // Fedora
  | 'direct';    // Direct download URL

export type Category =
  | 'browsers'
  | 'media'
  | 'development'
  | 'utilities'
  | 'security'
  | 'communication'
  | 'design'
  | 'gaming';

export interface PlatformInstall {
  type: InstallMethod;
  command: string;
  packageName?: string;
  directUrl?: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  website: string;
  sourceUrl?: string;
  platforms: {
    windows?: PlatformInstall;
    macos?: PlatformInstall;
    // Linux distro-specific commands
    ubuntu?: PlatformInstall;
    arch?: PlatformInstall;
    debian?: PlatformInstall;
    fedora?: PlatformInstall;
    // Generic linux fallback (used when distro-specific not available)
    linux?: PlatformInstall;
  };
  size?: number;
  popularity?: number;
  // Community submission metadata
  source?: 'core' | 'community';
  contributor?: string;
  verified?: boolean;
}
