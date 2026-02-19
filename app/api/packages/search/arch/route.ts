import { NextRequest, NextResponse } from 'next/server';

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

interface ArchResponse {
  version: number;
  limit: number;
  valid: boolean;
  results: ArchPackage[];
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

interface AURResponse {
  version: number;
  type: 'error' | 'search' | 'info' | 'multiinfo' | 'suggest';
  resultcount: number;
  results: AURPackage[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const officialURL = `https://archlinux.org/packages/search/json/?name=${encodeURIComponent(query)}&search_by=name`;
    const aurURL = `https://aur.archlinux.org/rpc?v=5&type=search&arg=${encodeURIComponent(query)}`;

    // Search both official repos and AUR in parallel
    const [officialResp, aurResp] = await Promise.all([
      fetch(officialURL).catch(() => null),
      fetch(aurURL).catch(() => null),
    ]);

    const results: any[] = [];

    // Process official packages
    if (officialResp && officialResp.ok) {
      const data: ArchResponse = await officialResp.json();
      for (const pkg of data.results.slice(0, Math.ceil(limit / 2))) {
        results.push({
          name: pkg.pkgname,
          identifier: pkg.pkgname,
          description: pkg.pkgdesc || '',
          version: pkg.pkgver,
          homepage: pkg.url || undefined,
          size: pkg.compressed_size / (1024 * 1024),
          repository: pkg.repo,
          packageManager: 'pacman',
        });
      }
    }

    // Process AUR packages
    if (aurResp && aurResp.ok) {
      const data: AURResponse = await aurResp.json();
      for (const pkg of data.results.slice(0, Math.ceil(limit / 2))) {
        results.push({
          name: pkg.Name,
          identifier: pkg.Name,
          description: pkg.Description || '',
          version: pkg.Version,
          homepage: pkg.URL || undefined,
          size: undefined,
          repository: 'aur',
          packageManager: 'pacman',
        });
      }
    }

    return NextResponse.json({ results: results.slice(0, limit) });
  } catch (error) {
    console.error('Arch search error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
