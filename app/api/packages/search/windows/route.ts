import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Chocolatey OData API - fetch all latest packages and filter
    // Note: This is limited by Chocolatey's API design
    const url = `https://community.chocolatey.org/api/v2/Packages()?$filter=IsLatestVersion&$top=${limit}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/atom+xml',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const xmlText = await response.text();

    // Parse XML and filter packages by query
    const packages = parseChocolateyXML(xmlText, query, limit);

    return NextResponse.json({ results: packages });
  } catch (error) {
    console.error('Chocolatey search error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}

interface ChocolateyPackage {
  Id: string;
  Title: string;
  Version: string;
  Description: string;
  ProjectUrl: string;
}

function parseChocolateyXML(xmlText: string, query: string, limit: number): ChocolateyPackage[] {
  const results: ChocolateyPackage[] = [];
  const lowerQuery = query.toLowerCase();

  // Match each <entry> element
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xmlText)) !== null) {
    if (results.length >= limit) break;

    const entry = match[1];

    // Extract properties using regex
    const id = extractProperty(entry, 'd:Id');
    const title = extractProperty(entry, 'd:Title');
    const version = extractProperty(entry, 'd:Version');
    const description = extractProperty(entry, 'd:Description');
    const projectUrl = extractProperty(entry, 'd:ProjectUrl');

    if (id && (id.toLowerCase().includes(lowerQuery) ||
                (title && title.toLowerCase().includes(lowerQuery)) ||
                (description && description.toLowerCase().includes(lowerQuery)))) {
      results.push({
        Id: id,
        Title: title || id,
        Version: version || '',
        Description: description || '',
        ProjectUrl: projectUrl || '',
      });
    }
  }

  return results;
}

function extractProperty(entry: string, tagName: string): string {
  // Match <tagName>value</tagName>
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
  const match = regex.exec(entry);
  return match ? match[1].trim() : '';
}
