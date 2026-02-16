'use client';

import * as React from 'react';
import { ExternalLink, Globe, PlayCircle, Code, Wrench, Shield, MessageSquare, Palette, Gamepad2, X } from 'lucide-react';
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

export function AppCard({ app, platform, checked, onCheckedChange }: AppCardProps) {
  const platformInstall = app.platforms[platform];
  const isCompatible = Boolean(platformInstall);
  const IconComponent = categoryIcons[app.category];

  return (
    <TooltipProvider>
      <Card
        className={`relative transition-all hover:shadow-md cursor-pointer overflow-hidden ${
          !isCompatible ? 'opacity-50' : ''
        } ${checked ? 'ring-2 ring-primary bg-primary/5' : ''}`}
        onClick={() => isCompatible && onCheckedChange(!checked)}
      >
        <CardHeader className="pb-3 p-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id={`app-${app.id}`}
              checked={checked && isCompatible}
              disabled={!isCompatible}
              onCheckedChange={onCheckedChange}
              className="mt-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base leading-tight truncate pr-1">
                  {app.name}
                </CardTitle>
                {app.sourceUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 shrink-0"
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
              <Badge variant="secondary" className="text-xs w-fit gap-1 mt-1">
                {IconComponent && <IconComponent className="h-3 w-3 shrink-0" />}
                <span className="truncate">{categories[app.category].name}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="text-xs line-clamp-2 break-words">
            {app.description}
          </CardDescription>
          {!isCompatible && (
            <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3 w-3 shrink-0" />
              <span>Not available for {platform}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
