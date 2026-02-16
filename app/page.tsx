'use client';

import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { CategoryFilter } from '@/components/category-filter';
import { SearchBar } from '@/components/search-bar';
import { AppCard } from '@/components/app-card';
import { CommandBar } from '@/components/command-bar';
import { apps, categories, Category } from '@/lib/data/apps';
import { detectPlatform } from '@/lib/utils/platform';
import { decodeAppIds } from '@/lib/utils/url';
import { App, Platform } from '@/types/app';

export default function HomePage() {
  const [platform, setPlatform] = React.useState<Platform>('windows');
  const [selectedCategory, setSelectedCategory] = React.useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedApps, setSelectedApps] = React.useState<Set<string>>(new Set());

  // Detect platform on mount
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

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
      // Platform compatibility
      const platformInstall = app.platforms[platform];
      if (!platformInstall) return false;

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

  // Get selected app objects
  const selectedAppObjects = useMemo(() => {
    return apps.filter((app) => selectedApps.has(app.id) && app.platforms[platform]);
  }, [selectedApps, platform]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container max-w-7xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Install all your apps in one click
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The open-source Ninite for Windows, macOS, and Linux.
            <br />
            Select apps, get your command, install from official sources.
          </p>
          <div className="mt-6 flex justify-center gap-2 text-sm text-muted-foreground">
            <span>✅ 100% Free & Open Source</span>
            <span>•</span>
            <span>✅ No Accounts Required</span>
            <span>•</span>
            <span>✅ No Tracking</span>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Detected: {platform === 'windows' ? 'Windows' : platform === 'macos' ? 'macOS' : 'Linux'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-64 shrink-0 md:block">
            <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
          </aside>

          {/* App Grid */}
          <div className="flex-1 space-y-6">
            {/* Mobile Category & Search */}
            <div className="flex flex-col gap-4 md:hidden">
              <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` in ${categories[selectedCategory].name}`}
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  platform={platform}
                  checked={selectedApps.has(app.id)}
                  onCheckedChange={() => toggleApp(app.id)}
                />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No apps found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Command Bar */}
      <CommandBar selectedApps={selectedAppObjects} platform={platform} />

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            PackStack • Open source under MIT License
          </p>
          <p className="flex items-center justify-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <span>•</span>
            <span>No tracking • No accounts • 100% free</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
