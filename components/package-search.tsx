'use client';

import * as React from 'react';
import { Search, Loader2, Package, AlertCircle, Check, TrendingUp } from 'lucide-react';
import { Platform, PackageMetadata } from '@/types/app';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getClientForPlatform } from '@/lib/api';
import { getPopularPackages } from '@/lib/data/popular-packages';

interface PackageSearchProps {
  platform: Platform;
  onSelect: (pkg: PackageMetadata) => void;
  selectedPackages: Set<string>;
}

export function PackageSearch({ platform, onSelect, selectedPackages }: PackageSearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<PackageMetadata[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Get popular packages for the current platform
  const popularPackages = React.useMemo(() => getPopularPackages(platform), [platform]);

  // Debounced search
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const client = getClientForPlatform(platform);

        if (!client) {
          setResults([]);
          setHasSearched(true);
          return;
        }

        const searchResults = await client.search(query, { limit: 50 });
        setResults(searchResults);
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search packages');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, platform]);

  const isSelected = (pkg: PackageMetadata) => selectedPackages.has(pkg.identifier);

  const getPackageManagerLabel = (pkg: PackageMetadata): string => {
    switch (pkg.packageManager) {
      case 'brew':
        return pkg.repository === 'cask' ? 'Cask' : 'Formula';
      case 'pacman':
        return pkg.repository === 'aur' ? 'AUR' : 'Official';
      case 'apt':
        return pkg.repository === 'snap' ? 'Snap' : (pkg.repository || 'apt');
      case 'choco':
      case 'chocolatey':
        return 'Chocolatey';
      case 'snap':
        return 'Snap';
      case 'dnf':
        return pkg.repository === 'snap' ? 'Snap' : (pkg.repository || 'Fedora');
      default:
        return pkg.packageManager;
    }
  };

  const getPackageManagerColor = (pkg: PackageMetadata): string => {
    switch (pkg.packageManager) {
      case 'brew':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'pacman':
        return pkg.repository === 'aur'
          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
          : 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'apt':
        return pkg.repository === 'snap'
          ? 'bg-green-500/10 text-green-500 border-green-500/20'
          : 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'choco':
      case 'chocolatey':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'snap':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'dnf':
        return pkg.repository === 'snap'
          ? 'bg-green-500/10 text-green-500 border-green-500/20'
          : 'bg-blue-600/10 text-blue-600 border-blue-600/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search packages for ${platform}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Status */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {/* Results */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {!hasSearched && query.length < 2 && (
          <div>
            {/* Popular Packages */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3 px-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Popular Packages</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularPackages.slice(0, 10).map((pkg) => (
                  <button
                    key={pkg.identifier}
                    onClick={() => onSelect(pkg)}
                    className={cn(
                      'text-left p-3 rounded-lg border-2 transition-all duration-200',
                      'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
                      'group',
                      isSelected(pkg)
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            'font-semibold text-sm',
                            isSelected(pkg) ? 'text-primary' : 'group-hover:text-primary transition-colors'
                          )}>
                            {pkg.name}
                          </span>
                          {isSelected(pkg) && (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {pkg.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search hint */}
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Or search for more packages</p>
              <p className="text-xs mt-1">Enter at least 2 characters to search</p>
            </div>
          </div>
        )}

        {hasSearched && results.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No packages found for "{query}"</p>
            <p className="text-sm mt-2">
              {platform === 'fedora'
                ? 'Package search is coming soon for Fedora. Try Debian, Ubuntu, macOS (Homebrew), Arch Linux, or Windows for now.'
                : 'Try a different search term'}
            </p>
          </div>
        )}

        {results.filter(pkg => pkg?.identifier).map((pkg) => (
          <button
            key={pkg.identifier}
            onClick={() => onSelect(pkg)}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
              'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
              'group',
              isSelected(pkg)
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/30'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'font-semibold text-base',
                    isSelected(pkg) ? 'text-primary' : 'group-hover:text-primary transition-colors'
                  )}>
                    {pkg.name}
                  </span>
                  {isSelected(pkg) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {pkg.description || 'No description available'}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn('text-xs', getPackageManagerColor(pkg))}>
                    {getPackageManagerLabel(pkg)}
                  </Badge>
                  {pkg.version && (
                    <span className="text-xs text-muted-foreground">
                      {pkg.version}
                    </span>
                  )}
                  {pkg.homepage && (
                    <a
                      href={pkg.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Homepage
                    </a>
                  )}
                </div>
              </div>

              {isSelected(pkg) && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Results Count */}
      {hasSearched && results.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {results.length} result{results.length !== 1 ? 's' : ''} • <button
            onClick={() => setQuery('')}
            className="text-primary hover:underline"
          >
            Show popular packages
          </button>
        </div>
      )}
    </div>
  );
}
