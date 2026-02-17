import {
  PackageManagerClient,
  PackageMetadata,
  SearchOptions,
  RateLimitError,
  PackageNotFoundError,
} from './base-client';
import { packageSearchCache, packageMetadataCache } from '../cache';

/**
 * Homebrew API client
 * Documentation: https://formulae.brew.sh/api/
 */
export class HomebrewClient implements PackageManagerClient {
  readonly type = 'brew' as const;

  private readonly baseURL = 'https://formulae.brew.sh/api';
  private readonly formulaEndpoint = '/formula';
  private readonly caskEndpoint = '/cask';
  private rateLimitRemaining = 10; // Approximate - Homebrew doesn't return rate limit info
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // 100ms between requests to avoid rate limiting

  /**
   * Make a rate-limited request to the Homebrew API
   */
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    // Rate limiting - wait minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError(
          new Date(Date.now() + 60000), // Assume 1 minute reset
          'Homebrew API rate limit exceeded'
        );
      }
      throw new Error(`Homebrew API error: ${response.status} ${response.statusText}`);
    }

    this.rateLimitRemaining--;
    return response.json();
  }

  /**
   * Convert Homebrew formula/cask to PackageMetadata
   */
  private toPackageMetadata(
    item: any,
    pkgType: 'formula' | 'cask'
  ): PackageMetadata {
    const identifier = item.token || item.name;
    const version = item.versions?.stable || item.version;
    const homepage = item.homepage || item.url;

    return {
      name: item.name || item.token,
      identifier,
      description: item.desc || '',
      version,
      homepage,
      size: this.parseSize(item),
      repository: pkgType,
      packageManager: 'brew',
    };
  }

  /**
   * Parse size from Homebrew data
   */
  private parseSize(item: any): number | undefined {
    // Try to get size from various fields
    if (item.size) return item.size / (1024 * 1024); // Convert bytes to MB
    if (item.installed_size) return item.installed_size / (1024 * 1024);
    return undefined;
  }

  /**
   * Search for formulae and casks
   */
  async search(query: string, options: SearchOptions = {}): Promise<PackageMetadata[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const limit = options.limit ?? 50;
    const cacheKey = `homebrew:search:${query}:${limit}`;

    // Check cache
    const cached = packageSearchCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      // Search both formulae and casks in parallel
      const [formulae, casks] = await Promise.all([
        this.fetchAPI<any[]>(`${this.formulaEndpoint}.json`)
          .then(data => data.filter((f: any) =>
            f.token?.toLowerCase().includes(query.toLowerCase()) ||
            f.name?.toLowerCase().includes(query.toLowerCase()) ||
            f.desc?.toLowerCase().includes(query.toLowerCase())
          ))
          .catch(() => []),
        this.fetchAPI<any[]>(`${this.caskEndpoint}.json`)
          .then(data => data.filter((c: any) =>
            c.token?.toLowerCase().includes(query.toLowerCase()) ||
            c.name?.toLowerCase().includes(query.toLowerCase()) ||
            c.desc?.toLowerCase().includes(query.toLowerCase())
          ))
          .catch(() => []),
      ]);

      // Combine and limit results
      const results: PackageMetadata[] = [];

      for (const formula of formulae.slice(0, limit)) {
        results.push(this.toPackageMetadata(formula, 'formula'));
        if (results.length >= limit) break;
      }

      for (const cask of casks.slice(0, limit)) {
        results.push(this.toPackageMetadata(cask, 'cask'));
        if (results.length >= limit) break;
      }

      // Cache the results
      packageSearchCache.set(cacheKey, JSON.stringify(results));

      return results;
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      console.error('Homebrew search error:', error);
      return [];
    }
  }

  /**
   * Get details for a specific formula or cask
   */
  async getPackage(identifier: string): Promise<PackageMetadata | null> {
    const cacheKey = `homebrew:package:${identifier}`;

    // Check cache
    const cached = packageMetadataCache.get(cacheKey);
    if (cached) {
      return cached as PackageMetadata;
    }

    try {
      // Try as formula first
      try {
        const formula = await this.fetchAPI<any>(`${this.formulaEndpoint}/${identifier}.json`);
        const metadata = this.toPackageMetadata(formula, 'formula');
        packageMetadataCache.set(cacheKey, metadata);
        return metadata;
      } catch {
        // Not a formula, try cask
      }

      // Try as cask
      try {
        const cask = await this.fetchAPI<any>(`${this.caskEndpoint}/${identifier}.json`);
        const metadata = this.toPackageMetadata(cask, 'cask');
        packageMetadataCache.set(cacheKey, metadata);
        return metadata;
      } catch {
        // Not found
      }

      throw new PackageNotFoundError(identifier, 'brew');
    } catch (error) {
      if (error instanceof PackageNotFoundError) {
        throw error;
      }
      console.error('Homebrew get package error:', error);
      return null;
    }
  }

  /**
   * Get current rate limit info
   */
  getRateLimitInfo() {
    return {
      limit: 10, // Approximate
      remaining: Math.max(0, this.rateLimitRemaining),
      resetAt: new Date(this.lastRequestTime + 60000),
    };
  }
}

// Singleton instance
export const homebrewClient = new HomebrewClient();
