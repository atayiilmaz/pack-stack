'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { CheckCircle2, Layers, Zap, Shield, Github, ArrowRight, Sparkles, X, Lock } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { OSSelector } from '@/components/os-selector';
import { CommandBar } from '@/components/command-bar';
import { PackageSearch } from '@/components/package-search';
import { Platform, PackageMetadata } from '@/types/app';
import { Button } from '@/components/ui/button';

type InstallableItem = PackageMetadata;

export default function HomePage() {
  const [platform, setPlatform] = useState<string>('macos');
  const [selectedItems, setSelectedItems] = useState<InstallableItem[]>([]);

  // Toggle item selection
  const toggleItem = useCallback((item: InstallableItem) => {
    setSelectedItems((prev) => {
      const identifier = item.identifier;
      const exists = prev.find(i => i.identifier === identifier);

      if (exists) {
        return prev.filter(i => i.identifier !== identifier);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  // Clear all selections
  const clearAll = () => {
    setSelectedItems([]);
  };

  // Get selected items as array for CommandBar
  const selectedItemsArray = React.useMemo(() => selectedItems, [selectedItems]);

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
            Search and install any package
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            Search package repositories in real-time. Generate installation scripts for any OS.
            All packages from official sources.
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
                <p className="text-xs text-muted-foreground">Verified packages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Real-time</p>
                <p className="text-xs text-muted-foreground">Live package search</p>
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
              <span>Search packages</span>
            </div>
            <ArrowRight className="h-4 w-4 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
              <span>Download script</span>
            </div>
          </div>
        </div>
      </section>

      {/* OS Selector Section */}
      <section id="how-it-works" className="border-b bg-muted/30">
        <div className="container max-w-5xl px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 1: Choose your platform</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Select your operating system</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We&apos;ll search the appropriate package repository and generate installation scripts
            </p>
          </div>
          <OSSelector value={platform} onChange={setPlatform} />
        </div>
      </section>

      {/* Package Search Section */}
      <section className="bg-muted/20">
        <div className="container max-w-4xl px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Step 2: Search and select packages</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Search packages</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Search the official package repository for {platform === 'macos' ? 'Homebrew' :
              platform === 'arch' ? 'Arch Linux (Official + AUR)' :
              platform === 'ubuntu' ? 'Ubuntu' :
              platform === 'debian' ? 'Debian' :
              platform === 'fedora' ? 'Fedora (via apt-compatible)' :
              platform === 'windows' ? 'Chocolatey' : 'your platform'}
            </p>
          </div>

          {/* Selected packages display */}
          {selectedItems.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Selected Packages</h3>
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <button
                    key={item.identifier}
                    onClick={() => toggleItem(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                  >
                    {item.name}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Package Search Component */}
          <PackageSearch
            platform={platform as Platform}
            onSelect={toggleItem}
            selectedPackages={new Set(selectedItems.map(i => i.identifier))}
          />
        </div>
      </section>

      {/* Command Bar */}
      <CommandBar selectedApps={selectedItemsArray} platform={platform as Platform} />

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
                The open-source package installer. Search official repositories and generate installation scripts.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-3">Project</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/atayiilmaz/pack-stack" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/atayiilmaz/pack-stack/blob/main/LICENSE" className="hover:text-foreground transition-colors">
                    MIT License
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
