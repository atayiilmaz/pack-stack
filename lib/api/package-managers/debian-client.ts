import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

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
        packageManager: 'apt',
      });
    }
  }

  return results;
}

/**
 * Parse a Debian package line from the allpackages file
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
 * Debian packages client
 * Uses the allpackages.txt.gz file from packages.debian.org
 * Note: For now, we'll use a static list approach since downloading and parsing
 * large gzip files in edge runtime is not practical
 */
export class DebianClient implements PackageManagerClient {
  readonly type = 'apt' as const;

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
    const cacheKey = `debian:search:${query}:${limit}`;

    // Check cache
    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // For now, return empty results with a note
    // TODO: Implement server-side package list caching
    console.log('Debian package search not yet implemented - requires server-side package list');

    const results: PackageMetadata[] = [];

    // Cache the results
    packageSearchCache.set(cacheKey, JSON.stringify(results));

    return results;
  }

  /**
   * Get package details
   */
  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `debian:package:${identifier}`;

    // Check cache
    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    // For now, return null
    // TODO: Implement server-side package lookup
    return null;
  }
}

// Singleton instance
export const debianClient = new DebianClient();
