import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  name: string;
  identifier: string;
  description: string;
  version: string;
  homepage?: string;
  repository: string;
  packageManager: string;
  downloads?: number;
}

// In-memory cache for Chocolatey packages
let chocolateyCache: SearchResult[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const lowerQuery = query.toLowerCase();

    // Check if we need to refresh the cache
    const now = Date.now();
    if (!chocolateyCache || (now - cacheTimestamp) > CACHE_DURATION) {
      console.log('Refreshing Chocolatey package cache...');
      chocolateyCache = await fetchChocolateyPackages();
      cacheTimestamp = now;
      console.log(`Cached ${chocolateyCache.length} Chocolatey packages`);
    }

    // Filter cached packages by query
    const filtered = chocolateyCache.filter(pkg =>
      pkg.identifier && (
        pkg.identifier.toLowerCase().includes(lowerQuery) ||
        (pkg.name && pkg.name.toLowerCase().includes(lowerQuery)) ||
        (pkg.description && pkg.description.toLowerCase().includes(lowerQuery))
      )
    );

    // Sort by relevance and downloads
    filtered.sort((a, b) => {
      const aExact = a.identifier === lowerQuery;
      const bExact = b.identifier === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStart = a.identifier.toLowerCase().startsWith(lowerQuery);
      const bStart = b.identifier.toLowerCase().startsWith(lowerQuery);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;

      return (b.downloads || 0) - (a.downloads || 0);
    });

    // Remove duplicates by identifier
    const uniqueResults = Array.from(
      new Map(filtered.map(pkg => [pkg.identifier, pkg])).values()
    );

    return NextResponse.json({ results: uniqueResults.slice(0, limit) });
  } catch (error) {
    console.error('Windows package search error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}

async function fetchChocolateyPackages(): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const maxPackages = 5000; // Limit to avoid long fetch times
  const pageSize = 200; // Larger pages for efficiency

  try {
    let nextUrl: string | null = 'https://community.chocolatey.org/api/v2/Packages()?$filter=IsLatestVersion&$orderby=DownloadCount%20desc&$top=' + pageSize;

    while (nextUrl && results.length < maxPackages) {
      const response = await fetch(nextUrl, {
        headers: { 'Accept': 'application/atom+xml' },
      });

      if (!response.ok) {
        console.error('Chocolatey API error:', response.status);
        break;
      }

      const xmlText = await response.text();
      const packages = parseChocolateyXML(xmlText);
      results.push(...packages);

      // Extract next page link
      const nextLinkMatch = /<link rel="next" href="([^"]+)"/.exec(xmlText);
      if (nextLinkMatch) {
        // Convert relative URL to absolute
        const href = nextLinkMatch[1].replace(/&amp;/g, '&');
        nextUrl = href.startsWith('http') ? href : `https://community.chocolatey.org${href}`;
      } else {
        nextUrl = null;
      }

      console.log(`Fetched ${results.length} packages so far...`);
    }

    return results;
  } catch (error) {
    console.error('Error fetching Chocolatey packages:', error);
    return results;
  }
}

function parseChocolateyXML(xmlText: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Match each <entry> element
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entry = match[1];

    // Extract package ID from <id> tag (e.g., Id='adobereader')
    const idMatch = /Id='([^']+)'/.exec(entry);
    const id = idMatch ? idMatch[1] : null;

    // Extract title from <title type="text"> tag
    const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(entry);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // Extract summary from <summary> tag (short description)
    const summaryMatch = /<summary[^>]*>([^<]+)<\/summary>/i.exec(entry);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Properties from m:properties section
    const version = extractProperty(entry, 'd:Version');
    const description = extractProperty(entry, 'd:Description') || summary;
    const projectUrl = extractProperty(entry, 'd:ProjectUrl');
    const downloadCount = extractProperty(entry, 'd:DownloadCount');

    if (id) {
      results.push({
        name: title || id,
        identifier: id,
        description: cleanDescription(description),
        version: version || '',
        homepage: projectUrl || undefined,
        repository: 'chocolatey',
        packageManager: 'chocolatey',
        downloads: downloadCount ? parseInt(downloadCount) : undefined,
      });
    }
  }

  return results;
}

function extractProperty(entry: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
  const match = regex.exec(entry);
  return match ? match[1].trim() : '';
}

function cleanDescription(desc: string): string {
  if (!desc) return '';
  // Remove markdown links and common formatting
  return desc
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\n+/g, ' ') // Convert newlines to spaces
    .trim()
    .substring(0, 300); // Limit description length
}
