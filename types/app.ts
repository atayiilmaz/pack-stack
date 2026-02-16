// App type definitions
export type Platform = 'windows' | 'macos' | 'linux';

export type InstallMethod =
  | 'winget'     // Windows Package Manager
  | 'choco'      // Chocolatey
  | 'brew'       // Homebrew Cask
  | 'apt'        // Debian/Ubuntu
  | 'snap'       // Snap Store
  | 'flatpak'    // Flatpak
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
    linux?: PlatformInstall;
  };
  size?: number;
  popularity?: number;
}
