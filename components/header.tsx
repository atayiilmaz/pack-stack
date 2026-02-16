'use client';

import Link from 'next/link';
import { Github, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Layers } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md group-hover:shadow-lg transition-all">
            <Layers className="h-5 w-5" />
          </div>
          <span className="hidden font-bold text-lg sm:inline-block group-hover:text-primary transition-colors">
            PackStack
          </span>
        </Link>

        <nav className="ml-auto flex items-center space-x-2 text-sm font-medium">
          <Link
            href="#how-it-works"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            How it Works
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
