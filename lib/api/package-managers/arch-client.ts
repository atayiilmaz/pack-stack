import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  RateLimitError,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Arch Linux official package API response
 */
interface ArchPackageResponse {
  version: number;
  limit: number;
  valid: boolean;
  results: ArchPackage[];
}

interface ArchPackage {
  pkgbase: string;
  pkgname: string;
  pkgver: string;
  pkgdesc: string | null;
  url: string | null;
  compressed_size: number;
  repo: string;
  arch: string;
}

/**
 * AUR RPC API response
 */
interface AURResponse {
  version: number;
  type: 'error' | 'search' | 'info' | 'multiinfo' | 'suggest';
  resultcount: number;
  results: AURPackage[];
}

interface AURPackage {
  ID: number;
  Name: string;
  PackageBaseID: number;
  PackageBase: string;
  Version: string;
  Description: string | null;
  URL: string | null;
  Keywords: string[];
  NumVotes: number;
  Popularity: number;
 OutOfDate: number | null;
}

/**
 * Arch Linux API client (official repositories + AUR)
 * Official: https://archlinux.org/packages/search/json/
 * AUR: https://aur.archlinux.org/rpc/
 */
export class ArchClient implements PackageManagerClient {
  readonly type = 'pacman' as const;

  private readonly officialURL = 'https://archlinux.org/packages/search/json';
  private readonly aurURL = 'https://aur.archlinux.org/rpc?v=5';

  /**
   * Search official repositories
   */
  private async searchOfficial(query: string, limit: number): Promise<PackageMetadata[]> {
    try {
      const url = `${this.officialURL}/?name=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Arch API error: ${response.status}`);
      }

      const data: ArchPackageResponse = await response.json();

      return data.results.slice(0, limit).map(pkg => ({
        name: pkg.pkgname,
        identifier: pkg.pkgname,
        description: pkg.pkgdesc || '',
        version: pkg.pkgver,
        homepage: pkg.url || undefined,
        size: pkg.compressed_size / (1024 * 1024), // Convert bytes to MB
        repository: pkg.repo,
        packageManager: 'pacman',
      }));
    } catch (error) {
      console.error('Arch official search error:', error);
      return [];
    }
  }

  /**
   * Search AUR
   */
  private async searchAUR(query: string, limit: number): Promise<PackageMetadata[]> {
    try {
      const url = `${this.aurURL}&type=search&arg=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`AUR API error: ${response.status}`);
      }

      const data: AURResponse = await response.json();

      return data.results.slice(0, limit).map(pkg => ({
        name: pkg.Name,
        identifier: pkg.Name,
        description: pkg.Description || '',
        version: pkg.Version,
        homepage: pkg.URL || undefined,
        size: undefined, // AUR doesn't provide size
        repository: 'aur',
        packageManager: 'pacman',
      }));
    } catch (error) {
      console.error('AUR search error:', error);
      return [];
    }
  }

  /**
   * Search both official repos and AUR
   */
  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = `arch:search:${query}:${limit}`;

    // Check cache
    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      // Search both sources in parallel
      const [official, aur] = await Promise.all([
        this.searchOfficial(query, Math.ceil(limit / 2)),
        this.searchAUR(query, Math.ceil(limit / 2)),
      ]);

      // Combine results
      const results = [...official, ...aur].slice(0, limit);

      // Cache the results
      packageSearchCache.set(cacheKey, JSON.stringify(results));

      return results;
    } catch (error) {
      console.error('Arch search error:', error);
      return [];
    }
  }

  /**
   * Get package details (tries official first, then AUR)
   */
  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `arch:package:${identifier}`;

    // Check cache
    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    try {
      // Try official repos first
      try {
        const url = `${this.officialURL}/?name=${encodeURIComponent(identifier)}`;
        const response = await fetch(url);

        if (response.ok) {
          const data: ArchPackageResponse = await response.json();
          if (data.results.length > 0) {
            const pkg = data.results[0];
            const metadata: PackageMetadata = {
              name: pkg.pkgname,
              identifier: pkg.pkgname,
              description: pkg.pkgdesc || '',
              version: pkg.pkgver,
              homepage: pkg.url || undefined,
              size: pkg.compressed_size / (1024 * 1024),
              repository: pkg.repo,
              packageManager: 'pacman',
            };
            packageMetadataCache.set(cacheKey, metadata);
            return metadata;
          }
        }
      } catch {
        // Continue to AUR
      }

      // Try AUR
      try {
        const url = `${this.aurURL}&type=info&arg=${encodeURIComponent(identifier)}`;
        const response = await fetch(url);

        if (response.ok) {
          const data: AURResponse = await response.json();
          if (data.results.length > 0) {
            const pkg = data.results[0];
            const metadata: PackageMetadata = {
              name: pkg.Name,
              identifier: pkg.Name,
              description: pkg.Description || '',
              version: pkg.Version,
              homepage: pkg.URL || undefined,
              repository: 'aur',
              packageManager: 'pacman',
            };
            packageMetadataCache.set(cacheKey, metadata);
            return metadata;
          }
        }
      } catch {
        // Not found
      }

      throw new PackageNotFoundError(identifier, 'pacman');
    } catch (error) {
      if (error instanceof PackageNotFoundError) {
        throw error;
      }
      console.error('Arch get package error:', error);
      return null;
    }
  }
}

// Singleton instance
export const archClient = new ArchClient();
