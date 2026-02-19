import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Ubuntu packages client
 * Searches Ubuntu packages via Next.js API route
 */
export class UbuntuClient implements PackageManagerClient {
  readonly type = 'apt' as const;
  private release: string = 'noble';

  setRelease(release: string): void {
    this.release = release;
  }

  private getSearchCacheKey(query: string, limit: number): string {
    return `ubuntu:search:${this.release}:${query}:${limit}`;
  }

  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = this.getSearchCacheKey(query, limit);

    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const url = `/api/packages/search/ubuntu?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const results: PackageMetadata[] = (data.results || []).map((pkg: any) => ({
        name: pkg.name,
        identifier: pkg.identifier,
        description: pkg.description || '',
        version: pkg.version || '',
        homepage: pkg.homepage,
        packageManager: 'apt',
        repository: 'ubuntu',
      }));

      packageSearchCache.set(cacheKey, JSON.stringify(results));
      return results;
    } catch (error) {
      return [];
    }
  }

  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `ubuntu:package:${this.release}:${identifier}`;

    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    // Search by identifier to get details
    const results = await this.search(identifier, { limit: 1 });
    if (results.length > 0) {
      packageMetadataCache.set(cacheKey, results[0]);
      return results[0];
    }

    return null;
  }
}

export const ubuntuClient = new UbuntuClient();
export const ubuntuClients: Record<string, UbuntuClient> = {
  noble: new UbuntuClient(),
  jammy: new UbuntuClient(),
  focal: new UbuntuClient(),
};

ubuntuClients.noble.setRelease('noble');
ubuntuClients.jammy.setRelease('jammy');
ubuntuClients.focal.setRelease('focal');
