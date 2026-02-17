/**
 * Package manager API clients
 * Unified exports for all package manager integrations
 */

export type {
  PackageManagerClient,
  PackageMetadata,
  RateLimitError,
  PackageNotFoundError,
  SearchOptions,
  RateLimitInfo,
} from './package-managers/base-client';

export { APICache, RequestDeduplicator, packageSearchCache, packageMetadataCache } from './cache';

export { homebrewClient, HomebrewClient } from './package-managers/homebrew-client';
export { archClient, ArchClient } from './package-managers/arch-client';
export { debianClient, DebianClient } from './package-managers/debian-client';
export { ubuntuClient, UbuntuClient, ubuntuClients } from './package-managers/ubuntu-client';

/**
 * Get the appropriate package manager client for a platform
 */
import { Platform } from '@/types/app';
import { PackageManagerClient } from './package-managers/base-client';
import { homebrewClient } from './package-managers/homebrew-client';
import { archClient } from './package-managers/arch-client';
import { debianClient } from './package-managers/debian-client';
import { ubuntuClient } from './package-managers/ubuntu-client';

export function getClientForPlatform(platform: Platform): PackageManagerClient | null {
  switch (platform) {
    case 'macos':
      return homebrewClient;
    case 'arch':
      return archClient;
    case 'debian':
      return debianClient;
    case 'ubuntu':
      return ubuntuClient;
    case 'fedora':
      // Fedora uses dnf, which doesn't have a public API
      // Fall back to debian client for similar packages
      return debianClient;
    case 'windows':
      // Winget doesn't have a public API
      // This would need to be implemented via GitHub scraping or CLI
      return null;
    default:
      return debianClient;
  }
}

/**
 * Search packages across all available managers for a platform
 */
import { PackageMetadata } from '@/types/app';

export async function searchPackages(
  query: string,
  platform: Platform,
  limit?: number
): Promise<PackageMetadata[]> {
  const client = getClientForPlatform(platform);
  if (!client) {
    return [];
  }
  return client.search(query, { limit });
}
