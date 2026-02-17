/**
 * Cache entry with TTL support
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Cache configuration
 */
interface CacheConfig {
  defaultTTL: number; // Default time to live in milliseconds
  maxSize: number; // Maximum number of entries per cache
  prefix: string; // Prefix for localStorage keys
}

/**
 * Cache utilities for API responses
 * Supports both in-memory and localStorage caching
 */
export class APICache<T> {
  private memoryCache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 60 * 60 * 1000, // 1 hour default
      maxSize: 100,
      prefix: 'packstack_cache_',
      ...config,
    };
  }

  /**
   * Generate cache key
   */
  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get value from cache (memory first, then localStorage)
   */
  get(key: string): T | null {
    // Check memory cache first
    const memEntry = this.memoryCache.get(key);
    if (memEntry && this.isValid(memEntry)) {
      return memEntry.data;
    }

    // Check localStorage
    if (typeof window !== 'undefined') {
      try {
        const lsKey = this.getKey(key);
        const item = localStorage.getItem(lsKey);
        if (item) {
          const entry: CacheEntry<T> = JSON.parse(item);
          if (this.isValid(entry)) {
            // Also store in memory for faster access
            this.memoryCache.set(key, entry);
            return entry.data;
          }
          // Remove expired entry
          localStorage.removeItem(lsKey);
        }
      } catch {
        // localStorage access failed, ignore
      }
    }

    return null;
  }

  /**
   * Set value in cache (both memory and localStorage)
   */
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTTL,
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Enforce max size
    if (this.memoryCache.size > this.config.maxSize) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    // Store in localStorage
    if (typeof window !== 'undefined') {
      try {
        const lsKey = this.getKey(key);
        localStorage.setItem(lsKey, JSON.stringify(entry));
      } catch {
        // localStorage full or disabled, ignore
      }
    }
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific entry
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.getKey(key));
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.config.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.config.prefix)) {
            const item = localStorage.getItem(key);
            if (item) {
              const entry: CacheEntry<T> = JSON.parse(item);
              if (!this.isValid(entry)) {
                localStorage.removeItem(key);
              }
            }
          }
        });
      } catch {
        // Ignore
      }
    }
  }
}

/**
 * Request deduplication utility
 * Prevents multiple simultaneous requests for the same resource
 */
export class RequestDeduplicator<T> {
  private pendingRequests: Map<string, Promise<T>> = new Map();

  /**
   * Execute a request, deduplicating simultaneous calls
   */
  async execute(key: string, fn: () => Promise<T>): Promise<T> {
    // If request is already pending, return existing promise
    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing;
    }

    // Create new request
    const promise = fn().finally(() => {
      // Remove from pending when done
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

// Pre-configured cache instances for different use cases
export const packageSearchCache = new APICache<string>({
  defaultTTL: 60 * 60 * 1000, // 1 hour
  maxSize: 200,
  prefix: 'packstack_search_',
});

export const packageMetadataCache = new APICache<object>({
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 500,
  prefix: 'packstack_metadata_',
});

export const debianPackagesCache = new APICache<string[]>({
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours - these don't change often
  maxSize: 10,
  prefix: 'packstack_debian_',
});

export const ubuntuPackagesCache = new APICache<string[]>({
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 10,
  prefix: 'packstack_ubuntu_',
});
