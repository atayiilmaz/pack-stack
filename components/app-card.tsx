'use client';

import * as React from 'react';
import { ExternalLink, Globe, PlayCircle, Code, Wrench, Shield, MessageSquare, Palette, Gamepad2 } from 'lucide-react';
import { App, Platform } from '@/types/app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { categories } from '@/lib/data/apps';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
  platform: Platform;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
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

const categoryColors: Record<string, string> = {
  browsers: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  media: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  development: 'bg-green-500/10 text-green-500 border-green-500/20',
  utilities: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  security: 'bg-red-500/10 text-red-500 border-red-500/20',
  communication: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  design: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  gaming: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

export function AppCard({ app, platform, checked, onCheckedChange }: AppCardProps) {
  const platformInstall = app.platforms[platform];
  const isCompatible = Boolean(platformInstall);
  const IconComponent = categoryIcons[app.category];
  const colorClass = categoryColors[app.category] || 'bg-muted text-muted-foreground';

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'relative transition-all duration-200 cursor-pointer overflow-hidden group',
          'hover:shadow-lg hover:-translate-y-0.5',
          !isCompatible && 'opacity-50',
          checked && 'ring-2 ring-primary bg-primary/5 shadow-md'
        )}
        onClick={() => isCompatible && onCheckedChange(!checked)}
      >
        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <CardHeader className="pb-3 p-4">
          <div className="flex items-start gap-3">
            {/* Custom styled checkbox */}
            <div className="relative shrink-0">
              <Checkbox
                id={`app-${app.id}`}
                checked={checked && isCompatible}
                disabled={!isCompatible}
                onCheckedChange={onCheckedChange}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              {checked && (
                <div className="absolute inset-0 rounded-md bg-primary/20 animate-ping" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base leading-tight truncate pr-1 group-hover:text-primary transition-colors">
                    {app.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs gap-1 mt-1.5 border font-medium',
                      colorClass
                    )}
                  >
                    {IconComponent && <IconComponent className="h-2.5 w-2.5 shrink-0" />}
                    <span className="truncate">{categories[app.category].name}</span>
                  </Badge>
                </div>

                {app.sourceUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0 shrink-0 hover:bg-primary/10 hover:text-primary"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={app.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="sr-only">Official source</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified official source</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <CardDescription className="text-xs line-clamp-2">
            {app.description}
          </CardDescription>

          {!isCompatible && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1.5">
              <Shield className="h-3 w-3 shrink-0" />
              <span>Not available for {platform}</span>
            </div>
          )}

          {isCompatible && checked && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-primary bg-primary/5 rounded-md px-2 py-1.5 border border-primary/10">
              <Check className="h-3 w-3 shrink-0" />
              <span>Added to installation</span>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
