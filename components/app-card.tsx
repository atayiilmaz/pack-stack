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
        className={`relative transition-all hover:shadow-md cursor-pointer ${
          !isCompatible ? 'opacity-50' : ''
        } ${checked ? 'ring-2 ring-primary bg-primary/5' : ''}`}
        onClick={() => isCompatible && onCheckedChange(!checked)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`app-${app.id}`}
                checked={checked && isCompatible}
                disabled={!isCompatible}
                onCheckedChange={onCheckedChange}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="space-y-2 flex-1 min-w-0">
                <CardTitle className="text-base leading-tight">{app.name}</CardTitle>
                <Badge variant="secondary" className="text-xs w-fit gap-1">
                  {IconComponent && <IconComponent className="h-3 w-3" />}
                  {categories[app.category].name}
                </Badge>
              </div>
            </div>
            {app.sourceUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 p-0 shrink-0"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={app.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-xs line-clamp-2">
            {app.description}
          </CardDescription>
          {!isCompatible && (
            <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Not available for {platform}
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
