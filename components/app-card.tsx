'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
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

interface AppCardProps {
  app: App;
  platform: Platform;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AppCard({ app, platform, checked, onCheckedChange }: AppCardProps) {
  const platformInstall = app.platforms[platform];
  const isCompatible = Boolean(platformInstall);

  return (
    <TooltipProvider>
      <Card
        className={`relative transition-all hover:shadow-md ${
          !isCompatible ? 'opacity-50' : ''
        } ${checked ? 'ring-2 ring-primary' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`app-${app.id}`}
                checked={checked && isCompatible}
                disabled={!isCompatible}
                onCheckedChange={onCheckedChange}
                className="mt-1"
              />
              <div className="space-y-1">
                <CardTitle className="text-base">{app.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {categories[app.category].icon} {categories[app.category].name}
                  </Badge>
                  {app.sourceUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          asChild
                        >
                          <a
                            href={app.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
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
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            {app.description}
          </CardDescription>
          {!isCompatible && (
            <p className="mt-2 text-xs text-muted-foreground">
              Not available for {platform}
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Import categories from data
import { categories } from '@/lib/data/apps';
