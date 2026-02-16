import { App } from '@/types/app';
import { coreApps } from './apps/core';
import { categories } from './categories';

/**
 * Load community apps from JSON files
 * These are dynamically imported to allow for community contributions
 */
async function loadCommunityApps(): Promise<App[]> {
  try {
    const categories = ['browsers', 'media', 'development', 'utilities', 'security', 'communication', 'design', 'gaming'] as const;

    const communityApps: App[] = [];

    for (const category of categories) {
      try {
        const module = await import(`./apps/community/${category}.json`);
        const apps: App[] = module.default || [];
        communityApps.push(...apps);
      } catch {
        // File doesn't exist or is empty - continue
      }
    }

    return communityApps;
  } catch {
    return [];
  }
}

/**
 * Combined apps - core + community
 * Community apps are loaded dynamically
 */
let cachedApps: App[] | null = null;

export async function getAllApps(): Promise<App[]> {
  if (cachedApps) {
    return cachedApps;
  }

  const communityApps = await loadCommunityApps();
  cachedApps = [...coreApps, ...communityApps];
  return cachedApps;
}

/**
 * Synchronous export of core apps for backward compatibility
 * This represents the curated, tested applications
 */
export const apps = coreApps;

/**
 * Core apps - curated, tested, and maintained by the PackStack team
 */
export { coreApps };

/**
 * Categories
 */
export { categories };
export type { Category } from './categories';