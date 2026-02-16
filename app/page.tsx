'use client';

import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { CheckCircle2, Download, Share2, Layers, Zap, Shield } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { CategoryFilter } from '@/components/category-filter';
import { SearchBar } from '@/components/search-bar';
import { AppCard } from '@/components/app-card';
import { CommandBar } from '@/components/command-bar';
import { apps, categories, Category } from '@/lib/data/apps';
import { decodeAppIds } from '@/lib/utils/url';
import { App, Platform } from '@/types/app';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [platform, setPlatform] = React.useState<string>('windows');
  const [selectedCategory, setSelectedCategory] = React.useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedApps, setSelectedApps] = React.useState<Set<string>>(new Set());

  // Load selected apps from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const appIds = decodeAppIds(hash);
      const validIds = new Set(appIds.filter((id) => apps.some((app) => app.id === id)));
      setSelectedApps(validIds);
    }
  }, []);

  // Filter apps based on platform, category, and search
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Platform compatibility - check if app supports selected OS
      const hasPlatform = app.platforms[platform as Platform] ||
                           app.platforms.linux; // Fallback to linux for distros

      if (!hasPlatform && platform !== 'linux') return false;

      // For Linux distros, check if app has linux support
      if (platform !== 'linux' && platform !== 'windows' && platform !== 'macos') {
        const linuxSupport = app.platforms.linux;
        if (!linuxSupport) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [platform, selectedCategory, searchQuery]);

  // Toggle app selection
  const toggleApp = (appId: string) => {
    setSelectedApps((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedApps(new Set());
    window.history.replaceState(null, '', ' ');
  };

  // Select all visible
  const selectAllVisible = () => {
    const visibleIds = new Set(filteredApps.map((app) => app.id));
    setSelectedApps((prev) => new Set([...prev, ...visibleIds]));
  };

  // Get selected app objects
  const selectedAppObjects = useMemo(() => {
    return apps.filter((app) => selectedApps.has(app.id));
  }, [selectedApps]);

  // Get platform label for display
  const getPlatformLabel = (os: string) => {
    switch (os) {
      case 'windows': return 'Windows';
      case 'macos': return 'macOS';
      case 'ubuntu': return 'Ubuntu';
      case 'arch': return 'Arch Linux';
      case 'debian': return 'Debian';
      case 'fedora': return 'Fedora';
      default: return os;
    }
  };

  return (
    <AppLayout platform={platform} setPlatform={setPlatform}>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container max-w-7xl px-4 py-12 md:py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Layers className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              PackStack
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Install all your apps in one click
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            The open-source Ninite alternative for Windows, macOS, and Linux.
            <br />
            Select apps, get your command, install from official sources.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>100% Free & Open Source</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Official Sources Only</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>No Accounts Required</span>
            </div>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20">
              Selected: {getPlatformLabel(platform)}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
          </aside>

          {/* App Grid */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Mobile Category & Search */}
            <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
              <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Desktop Search & Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              {filteredApps.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllVisible}>
                    Select All
                  </Button>
                  {selectedApps.size > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${categories[selectedCategory].name}`}
              </span>
              {selectedApps.size > 0 && (
                <span className="text-primary font-medium">
                  {selectedApps.size} selected
                </span>
              )}
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  platform={platform as Platform}
                  checked={selectedApps.has(app.id)}
                  onCheckedChange={() => toggleApp(app.id)}
                />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No apps found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Command Bar */}
      <CommandBar selectedApps={selectedAppObjects} platform={platform as Platform} />

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground text-xs font-bold">
                P
              </div>
              <span>PackStack • Open source under MIT License</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                No tracking • No accounts
              </span>
            </div>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
