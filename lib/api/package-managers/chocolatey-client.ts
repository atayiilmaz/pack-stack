import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Chocolatey client - uses Next.js API route to bypass CORS
 */
export class ChocolateyClient implements PackageManagerClient {
  readonly type = 'choco' as const;

  /**
   * Search for packages via API route
   */
  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = `chocolatey:search:${query}:${limit}`;

    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const url = `/api/packages/search/windows?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Chocolatey API error:', response.status);
        return [];
      }

      const data = await response.json();
      const results: PackageMetadata[] = (data.results || []).map((pkg: any) => ({
        name: pkg.Title || pkg.Id,
        identifier: pkg.Id,
        description: pkg.Description || '',
        version: pkg.Version,
        homepage: pkg.ProjectUrl || undefined,
        packageManager: 'choco',
      }));

      packageSearchCache.set(cacheKey, JSON.stringify(results));
      return results;
    } catch (error) {
      console.error('Chocolatey search error:', error);
      return [];
    }
  }

  /**
   * Get package details
   */
  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `chocolatey:package:${identifier}`;

    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    // For now, search by the identifier to get details
    const results = await this.search(identifier, { limit: 1 });
    if (results.length > 0) {
      packageMetadataCache.set(cacheKey, results[0]);
      return results[0];
    }

    return null;
  }
}

export const chocolateyClient = new ChocolateyClient();
