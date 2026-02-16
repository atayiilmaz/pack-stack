'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { OSSelector } from '@/components/os-selector';
import { Platform } from '@/types/app';

interface HeaderProps {
  platform: string;
  setPlatform: (os: string) => void;
}

export function Header({ platform, setPlatform }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-2 2 0-5-2 10z" />
            </svg>
          </div>
          <span className="hidden font-bold sm:inline-block">
            PackStack
          </span>
        </Link>

        {/* OS Selector */}
        <div className="mr-auto">
          <OSSelector value={platform} onChange={setPlatform} />
        </div>

        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
