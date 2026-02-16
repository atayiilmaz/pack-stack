/**
 * JSON Schema for validating community-submitted apps
 * This ensures all community contributions follow the correct structure
 */
export const communityAppSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'PackStack Community App',
  description: 'Schema for community-submitted applications',
  type: 'object',
  required: ['id', 'name', 'description', 'category', 'icon', 'website', 'platforms'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Unique identifier (kebab-case)',
    },
    name: {
      type: 'string',
      minLength: 1,
      description: 'Application name',
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
      description: 'Short description of the application',
    },
    category: {
      type: 'string',
      enum: ['browsers', 'media', 'development', 'utilities', 'security', 'communication', 'design', 'gaming'],
      description: 'Category this app belongs to',
    },
    icon: {
      type: 'string',
      pattern: '^/icons/.+\\.(svg|png|jpg)$',
      description: 'Path to app icon',
    },
    website: {
      type: 'string',
      format: 'uri',
      description: 'Official website URL',
    },
    sourceUrl: {
      type: 'string',
      format: 'uri',
      description: 'Source code URL (optional)',
    },
    platforms: {
      type: 'object',
      description: 'Platform-specific installation info',
      properties: {
        windows: {
          $ref: '#/definitions/platformInstall',
        },
        macos: {
          $ref: '#/definitions/platformInstall',
        },
        linux: {
          $ref: '#/definitions/platformInstall',
        },
      },
      minProperties: 1,
      additionalProperties: false,
    },
    size: {
      type: 'number',
      minimum: 0,
      description: 'Download size in MB (optional)',
    },
    popularity: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      description: 'Popularity score 0-100 (optional)',
    },
    // Community-specific metadata
    contributor: {
      type: 'string',
      description: 'GitHub username of contributor',
    },
    source: {
      type: 'string',
      enum: ['community'],
      description: 'Source of this app entry',
    },
    submittedAt: {
      type: 'string',
      format: 'date-time',
      description: 'ISO timestamp of submission',
    },
    verified: {
      type: 'boolean',
      description: 'Whether installation commands have been verified',
    },
  },
  definitions: {
    platformInstall: {
      type: 'object',
      required: ['type', 'command'],
      properties: {
        type: {
          type: 'string',
          enum: ['winget', 'choco', 'brew', 'apt', 'snap', 'flatpak', 'dnf', 'direct'],
          description: 'Package manager or installation type',
        },
        command: {
          type: 'string',
          minLength: 1,
          description: 'Installation command',
        },
        packageName: {
          type: 'string',
          description: 'Package name (optional)',
        },
        directUrl: {
          type: 'string',
          format: 'uri',
          description: 'Direct download URL (for type: direct)',
        },
      },
    },
  },
} as const;

/**
 * Helper type for community apps (includes contributor metadata)
 */
export interface CommunityAppMetadata {
  contributor?: string;
  source: 'community';
  submittedAt?: string;
  verified?: boolean;
}
