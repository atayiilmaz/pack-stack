'use client';

import Link from 'next/link';
import { Layers, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </div>
          <span className="hidden font-bold sm:inline-block">
            PackStack
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
