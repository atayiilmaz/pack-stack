'use client';

import * as React from 'react';
import { categories, Category } from '@/lib/data/apps';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface CategoryFilterProps {
  value: Category | 'all';
  onChange: (value: Category | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <>
      {/* Desktop - Vertical Tabs */}
      <div className="hidden md:block">
        <Tabs value={value} onValueChange={(v) => onChange(v as Category | 'all')} orientation="vertical">
          <TabsList className="h-auto flex-col items-start justify-start space-y-1 rounded-lg bg-muted/50 p-2">
            <TabsTrigger value="all" className="w-full justify-start">
              📦 All Apps
            </TabsTrigger>
            {Object.entries(categories).map(([key, { name, icon }]) => (
              <TabsTrigger key={key} value={key} className="w-full justify-start">
                {icon} {name}
              </TabsTrigger>
            ))}
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
              className="w-full justify-start"
              onClick={() => onChange('all')}
            >
              📦 All Apps
            </Button>
            {Object.entries(categories).map(([key, { name, icon }]) => (
              <Button
                key={key}
                variant={value === key ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onChange(key as Category)}
              >
                {icon} {name}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
