'use client';

import * as React from 'react';
import { Package, Globe, PlayCircle, Code, Wrench, Shield, MessageSquare, Palette, Gamepad2 } from 'lucide-react';
import { categories, Category } from '@/lib/data/apps';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  value: Category | 'all';
  onChange: (value: Category | 'all') => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  browsers: Globe,
  media: PlayCircle,
  development: Code,
  utilities: Wrench,
  security: Shield,
  communication: MessageSquare,
  design: Palette,
  gaming: Gamepad2,
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <>
      {/* Desktop - Vertical Tabs */}
      <div className="hidden md:block">
        <Tabs value={value} onValueChange={(v) => onChange(v as Category | 'all')} orientation="vertical">
          <TabsList className="h-auto flex-col items-start justify-start space-y-1 rounded-lg bg-muted/50 p-2">
            <TabsTrigger value="all" className="w-full justify-start gap-2">
              <Package className="h-4 w-4" />
              All Apps
            </TabsTrigger>
            {Object.entries(categories).map(([key, { name, icon }]) => {
              const IconComponent = categoryIcons[key];
              return (
                <TabsTrigger key={key} value={key} className="w-full justify-start gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile - Sheet */}
      <Sheet>
        <div className="md:hidden">
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Menu className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="w-64">
          <SheetTitle>Categories</SheetTitle>
          <div className="mt-6 space-y-2">
            <Button
              variant={value === 'all' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onChange('all')}
            >
              <Package className="h-4 w-4" />
              All Apps
            </Button>
            {Object.entries(categories).map(([key, { name }]) => {
              const IconComponent = categoryIcons[key];
              return (
                <Button
                  key={key}
                  variant={value === key ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => onChange(key as Category)}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {name}
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
