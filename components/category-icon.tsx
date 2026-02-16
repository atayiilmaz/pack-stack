'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  name: keyof typeof LucideIcons;
  className?: string;
}

const iconMap = LucideIcons;

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <span className={className}>📦</span>;
  }

  return <IconComponent className={className} />;
}

// Helper function to get icon component
export function getCategoryIcon(name: string) {
  return iconMap[name as keyof typeof LucideIcons];
}
