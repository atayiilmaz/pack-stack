import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Fedora packages client
 * Note: Fedora DNF packages don't have a public JSON API.
 * This client returns empty results with a helpful message.
 * TODO: Implement via Next.js API route for server-side package fetching
 */
export class FedoraClient implements PackageManagerClient {
  readonly type = 'dnf' as const;

  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = `fedora:search:${query}:${limit}`;

    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fedora doesn't have a public API for DNF packages
    const results: PackageMetadata[] = [];

    packageSearchCache.set(cacheKey, JSON.stringify(results));
    return results;
  }

  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `fedora:package:${identifier}`;

    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    return null;
  }
}

export const fedoraClient = new FedoraClient();
