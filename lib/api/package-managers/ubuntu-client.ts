import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Ubuntu packages client
 * Note: Ubuntu/Debian apt packages don't have a public JSON API.
 * Packages are available via:
 * 1. Snap Store (for snaps - universal Linux packages)
 * 2. Local apt commands (apt-cache search, apt-cache show)
 * 3. Downloading Packages.gz files (requires server-side processing)
 *
 * This client returns empty results with a helpful message.
 * TODO: Implement via Next.js API route for server-side package fetching
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

    // Ubuntu/Debian don't have public APIs for apt packages
    // Return empty results - the UI will show a helpful message
    const results: PackageMetadata[] = [];

    packageSearchCache.set(cacheKey, JSON.stringify(results));
    return results;
  }

  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `ubuntu:package:${this.release}:${identifier}`;

    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
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
