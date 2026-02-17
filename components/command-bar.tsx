'use client';

import * as React from 'react';
import { Copy, Download, Share2, Terminal, FileDown } from 'lucide-react';
import { App, Platform, PackageMetadata } from '@/types/app';
import { generateScriptContent, downloadScript, formatSize, getTotalSize, getPlatformDisplayName } from '@/lib/utils/scripts';
import { updateHash } from '@/lib/utils/url';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type InstallableItem = App | PackageMetadata;

interface CommandBarProps {
  selectedApps: InstallableItem[];
  platform: Platform;
}

export function CommandBar({ selectedApps, platform }: CommandBarProps) {
  const fullScript = React.useMemo(() => generateScriptContent(selectedApps, platform), [selectedApps, platform]);
  const totalSize = React.useMemo(() => getTotalSize(selectedApps), [selectedApps]);
  const platformName = React.useMemo(() => getPlatformDisplayName(platform), [platform]);

  const handleCopyScript = async () => {
    if (!fullScript) return;
    await navigator.clipboard.writeText(fullScript);
    toast.success('Script copied to clipboard');
  };

  const handleDownload = () => {
    if (selectedApps.length === 0) return;
    downloadScript(selectedApps, platform);
    toast.success('Script downloaded');
  };

  const handleShare = async () => {
    // For PackageMetadata, we can't share via hash since they're dynamic
    // Only support sharing for App items with IDs
    const appIds = selectedApps
      .filter((app): app is App => 'id' in app)
      .map((app) => (app as App).id);

    if (appIds.length === 0) {
      toast.error('Sharing is only available for curated apps');
      return;
    }

    updateHash(appIds);
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  if (selectedApps.length === 0) {
    return (
      <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-7xl items-center px-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 opacity-50" />
            Search and select packages to generate installation script
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg max-h-[50vh] overflow-y-auto">
      <div className="container max-w-7xl px-4 py-4 sm:py-5">
        <div className="flex flex-col gap-4">
          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-xs px-2 py-1">
                {selectedApps.length} package{selectedApps.length !== 1 ? 's' : ''}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {platformName} • Total size: ~{formatSize(totalSize)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" />
              <span>Installation script ready</span>
            </div>
          </div>

          {/* Script Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Terminal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  readOnly
                  value={fullScript}
                  className="min-h-[200px] max-h-[300px] resize-none font-mono text-xs pl-10 py-3"
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.select();
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 sm:self-center">
              <Button
                onClick={handleCopyScript}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Script</span>
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
