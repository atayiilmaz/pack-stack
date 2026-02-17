import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { ubuntuPackagesCache, packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Parse an Ubuntu package line from the allpackages file
 */
function parsePackageLine(line: string): { name: string; version?: string; description?: string } | null {
  line = line.trim();

  if (!line || line.startsWith('#')) {
    return null;
  }

  const match = line.match(/^(\S+)(?:\s+\(([^)]+)\))?(?:\s+(.+))?$/);
  if (match) {
    const [, name, version, description] = match;
    return { name, version, description };
  }

  return null;
}

/**
 * Search in the cached package list
 */
function searchInPackageList(packageList: string[], query: string, limit: number): PackageMetadata[] {
  const results: PackageMetadata[] = [];
  const lowerQuery = query.toLowerCase();

  for (const line of packageList) {
    if (results.length >= limit) break;

    const parsed = parsePackageLine(line);
    if (parsed && parsed.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        name: parsed.name,
        identifier: parsed.name,
        description: parsed.description || '',
        version: parsed.version,
        repository: 'ubuntu',
        packageManager: 'apt',
      });
    }
  }

  return results;
}

/**
 * Ubuntu packages client
 * Uses the allpackages.txt.gz file from packages.ubuntu.com
 * Note: For now, we'll use a static list approach since downloading and parsing
 * large gzip files in edge runtime is not practical
 */
export class UbuntuClient implements PackageManagerClient {
  readonly type = 'apt' as const;
  private release: string = 'noble'; // Default to LTS

  /**
   * Set the Ubuntu release to use
   */
  setRelease(release: string): void {
    this.release = release;
  }

  /**
   * Get the cache key for the package list
   */
  private getPackageListCacheKey(): string {
    return `ubuntu:package_list:${this.release}`;
  }

  /**
   * Search for packages
   * For now, this is a placeholder - in production, you'd want to:
   * 1. Download and cache the Packages.gz file server-side
   * 2. Parse it into a searchable format
   * 3. Serve via the API route
   */
  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = `ubuntu:search:${this.release}:${query}:${limit}`;

    // Check cache
    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // For now, return empty results
    // TODO: Implement server-side package list caching
    console.log('Ubuntu package search not yet implemented - requires server-side package list');

    const results: PackageMetadata[] = [];

    // Cache the results
    packageSearchCache.set(cacheKey, JSON.stringify(results));

    return results;
  }

  /**
   * Get package details
   */
  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `ubuntu:package:${this.release}:${identifier}`;

    // Check cache
    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    // For now, return null
    return null;
  }
}

// Singleton instances for different releases
export const ubuntuClient = new UbuntuClient();
export const ubuntuClients: Record<string, UbuntuClient> = {
  noble: new UbuntuClient(), // 24.04 LTS
  jammy: new UbuntuClient(), // 22.04 LTS
  focal: new UbuntuClient(), // 20.04 LTS
};

// Set releases
ubuntuClients.noble.setRelease('noble');
ubuntuClients.jammy.setRelease('jammy');
ubuntuClients.focal.setRelease('focal');
