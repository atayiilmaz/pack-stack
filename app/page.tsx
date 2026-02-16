'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Layers,
  Zap,
  Shield,
  Terminal,
  Package,
  Clock,
  Lock,
  Github,
  ArrowRight,
  Sparkles,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { CategoryFilter } from '@/components/category-filter';
import { SearchBar } from '@/components/search-bar';
import { AppCard } from '@/components/app-card';
import { CommandBar } from '@/components/command-bar';
import { OSSelector } from '@/components/os-selector';
import { apps, categories, Category } from '@/lib/data/apps';
import { decodeAppIds } from '@/lib/utils/url';
import { App, Platform } from '@/types/app';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [platform, setPlatform] = useState<string>('windows');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());

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
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-muted/20 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container max-w-6xl px-4 py-16 md:py-24 text-center relative">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-3 mb-6 animate-fadeIn">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <Layers className="h-7 w-7" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              PackStack
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            Install all your apps in one click
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            The open-source alternative to Ninite. Select your apps, get a single command,
            and install everything from official sources. No bloat, no bundles, no tracking.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">100% Free</p>
                <p className="text-xs text-muted-foreground">Open source forever</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Official Sources</p>
                <p className="text-xs text-muted-foreground">Verified downloads</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Lightning Fast</p>
                <p className="text-xs text-muted-foreground">One command setup</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">No Accounts</p>
                <p className="text-xs text-muted-foreground">No sign-up required</p>
              </div>
            </div>
          </div>

          {/* How it works preview */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              <span>Choose your OS</span>
            </div>
            <ArrowRight className="h-4 w-4 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              <span>Select your apps</span>
            </div>
            <ArrowRight className="h-4 w-4 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
              <span>Copy & run command</span>
            </div>
          </div>
        </div>
      </section>

      {/* OS Selector Section */}
      <section className="border-b bg-muted/30">
        <div className="container max-w-5xl px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 1: Choose your platform</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Select your operating system</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We'll generate the correct installation commands using your system's native package manager
            </p>
          </div>
          <OSSelector value={platform} onChange={setPlatform} />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b bg-background">
        <div className="container max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How PackStack Works</h2>
            <p className="text-muted-foreground">Three simple steps to install all your favorite software</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4 shadow-lg shadow-blue-500/25">
                  <Cpu className="h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">Select Your OS</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your operating system and we'll match you with the right package manager
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4 shadow-lg shadow-purple-500/25">
                  <Package className="h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Pick Your Apps</h3>
                <p className="text-sm text-muted-foreground">
                  Browse our curated collection and select the apps you want to install
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mb-4 shadow-lg shadow-green-500/25">
                  <Terminal className="h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Copy & Run</h3>
                <p className="text-sm text-muted-foreground">
                  Get a single command that installs everything from official sources
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Selection Section */}
      <section className="bg-muted/20">
        <div className="container max-w-7xl px-4 py-8 md:py-12">
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
        </div>
      </section>

      {/* Command Bar */}
      <CommandBar selectedApps={selectedAppObjects} platform={platform as Platform} />

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-bold">PackStack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The open-source Ninite alternative. Install apps from official sources with one command.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-3">Project</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Request an App
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    MIT License
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>No tracking • No accounts</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} PackStack. Open source under MIT License.</p>
            <p>Made with ❤️ for the open-source community</p>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
