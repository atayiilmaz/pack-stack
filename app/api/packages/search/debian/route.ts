import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  name: string;
  identifier: string;
  description: string;
  version: string;
  homepage?: string;
  repository: string;
  packageManager: string;
}

// In-memory cache for Debian packages (built progressively)
let debianCache: SearchResult[] | null = null;
let isCacheBuilding = false;
let cacheTimestamp = 0;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const lowerQuery = query.toLowerCase();

    // If cache is being built, return empty with special header
    if (isCacheBuilding) {
      return NextResponse.json({ results: [], building: true }, {
        headers: { 'X-Cache-Building': 'true' }
      });
    }

    // Start building cache in background if not exists
    if (!debianCache) {
      // Don't await - build in background
      buildCacheInBackground();
    }

    // Search in available cache (may be incomplete during initial build)
    const filtered = debianCache
      ? debianCache.filter(pkg =>
          pkg.identifier.toLowerCase().includes(lowerQuery) ||
          (pkg.description && pkg.description.toLowerCase().includes(lowerQuery))
        ).slice(0, limit)
      : [];

    return NextResponse.json({ results: filtered });
  } catch (error) {
    console.error('Debian search error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}

function buildCacheInBackground(): void {
  if (isCacheBuilding) return;
  isCacheBuilding = true;

  (async () => {
    try {
      const url = 'http://ftp.debian.org/debian/dists/stable/main/binary-amd64/Packages.gz';
      const response = await fetch(url, {
        // Signal that this is a background fetch
        signal: undefined,
      });

      if (!response.ok) {
        return;
      }

      const compressed = await response.arrayBuffer();
      const zlib = await import('zlib');
      const buffer = Buffer.from(compressed);
      const decompressed = zlib.gunzipSync(buffer);
      const text = decompressed.toString('utf-8');

      // Parse all packages for cache
      debianCache = parseAllPackages(text);
      cacheTimestamp = Date.now();
      console.log(`Debian cache built with ${debianCache.length} packages`);
    } catch (error) {
      console.error('Error building Debian cache:', error);
    } finally {
      isCacheBuilding = false;
    }
  })();
}

function parseAllPackages(text: string): SearchResult[] {
  const results: SearchResult[] = [];
  const blocks = text.split(/\n\n+/);

  for (const block of blocks) {
    const pkg: Record<string, string> = {};

    for (const line of block.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const field = trimmed.substring(0, colonIndex);
        const value = trimmed.substring(colonIndex + 1).trim();
        pkg[field] = value;
      }
    }

    if (pkg.Package) {
      results.push({
        name: pkg.Package,
        identifier: pkg.Package,
        description: pkg.Description || '',
        version: pkg.Version || '',
        homepage: pkg.Homepage || undefined,
        repository: 'debian',
        packageManager: 'apt',
      });
    }
  }

  return results;
}
