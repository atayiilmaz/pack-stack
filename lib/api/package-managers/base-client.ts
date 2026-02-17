import { InstallMethod } from '@/types/app';

/**
 * Metadata for a package from any package manager
 */
export interface PackageMetadata {
  name: string;           // Display name
  identifier: string;     // Package identifier for installation
  description: string;
  version?: string;
  homepage?: string;
  size?: number;          // Size in MB
  repository?: string;    // repo/channel info
  packageManager: InstallMethod;
}

/**
 * Rate limit information for an API
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Search options for package queries
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
}

/**
 * Base interface for all package manager clients
 */
export interface PackageManagerClient {
  /**
   * The package manager type this client handles
   */
  readonly type: InstallMethod;

  /**
   * Search for packages by query string
   * @param query - Search query
   * @param options - Search options including limit and offset
   * @returns Array of matching package metadata
   */
  search(query: string, options?: SearchOptions): Promise<PackageMetadata[]>;

  /**
   * Get detailed metadata for a specific package
   * @param identifier - Package identifier
   * @returns Package metadata or null if not found
   */
  getPackage(identifier: string): Promise<PackageMetadata | null>;

  /**
   * Get current rate limit information (if available)
   * @returns Rate limit info or undefined if not tracked
   */
  getRateLimitInfo?(): RateLimitInfo | undefined;
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends Error {
  constructor(
    public readonly resetAt: Date,
    message?: string
  ) {
    super(message || `Rate limit exceeded. Resets at ${resetAt.toISOString()}`);
    this.name = 'RateLimitError';
  }
}

/**
 * Error thrown when package is not found
 */
export class PackageNotFoundError extends Error {
  constructor(
    public readonly identifier: string,
    public readonly manager: InstallMethod
  ) {
    super(`Package '${identifier}' not found in ${manager}`);
    this.name = 'PackageNotFoundError';
  }
}
