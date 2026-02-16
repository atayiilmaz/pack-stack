'use client';

import * as React from 'react';
import { App, Platform } from '@/types/app';
import { Header } from '@/components/header';

interface AppLayoutProps {
  children: React.ReactNode;
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

export function AppLayout({ children, platform, setPlatform }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header platform={platform} setPlatform={setPlatform} />
      {children}
    </div>
  );
}
