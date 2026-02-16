import { App } from '@/types/app';
import { coreBrowsersApps } from './browsers';
import { coreMediaApps } from './media';
import { coreDevelopmentApps } from './development';
import { coreUtilitiesApps } from './utilities';
import { coreSecurityApps } from './security';
import { coreCommunicationApps } from './communication';
import { coreDesignApps } from './design';
import { coreGamingApps } from './gaming';

/**
 * Core apps are curated, tested, and maintained by the PackStack team.
 * These are the most popular and reliable applications across all categories.
 */
export const coreApps: App[] = [
  ...coreBrowsersApps,
  ...coreMediaApps,
  ...coreDevelopmentApps,
  ...coreUtilitiesApps,
  ...coreSecurityApps,
  ...coreCommunicationApps,
  ...coreDesignApps,
  ...coreGamingApps,
];

/**
 * Individual category exports for more granular imports
 */
export const coreAppsByCategory = {
  browsers: coreBrowsersApps,
  media: coreMediaApps,
  development: coreDevelopmentApps,
  utilities: coreUtilitiesApps,
  security: coreSecurityApps,
  communication: coreCommunicationApps,
  design: coreDesignApps,
  gaming: coreGamingApps,
} as const;
