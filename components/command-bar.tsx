'use client';

import * as React from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import { App, Platform } from '@/types/app';
import { generateCommand, downloadScript, formatSize, getTotalSize } from '@/lib/utils/scripts';
import { updateHash } from '@/lib/utils/url';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CommandBarProps {
  selectedApps: App[];
  platform: Platform;
}

export function CommandBar({ selectedApps, platform }: CommandBarProps) {
  const command = React.useMemo(() => generateCommand(selectedApps, platform), [selectedApps, platform]);
  const totalSize = React.useMemo(() => getTotalSize(selectedApps), [selectedApps]);

  const handleCopy = async () => {
    if (!command) return;
    await navigator.clipboard.writeText(command);
    toast.success('Command copied to clipboard');
  };

  const handleDownload = () => {
    if (selectedApps.length === 0) return;
    downloadScript(selectedApps, platform);
    toast.success('Script downloaded');
  };

  const handleShare = async () => {
    const appIds = selectedApps.map((app) => app.id);
    updateHash(appIds);
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  if (selectedApps.length === 0) {
    return (
      <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center px-4">
          <p className="text-sm text-muted-foreground">
            Select apps to generate installation command
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">
              Selected: {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} • Total size: ~{formatSize(totalSize)}
            </p>
            <Textarea
              readOnly
              value={command}
              className="h-16 resize-none font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleCopy} variant="default" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
