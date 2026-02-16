'use client';

import * as React from 'react';
import { Copy, Download, Share2, Terminal, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { App, Platform } from '@/types/app';
import { generateCommand, generateScriptContent, downloadScript, formatSize, getTotalSize, getPlatformDisplayName } from '@/lib/utils/scripts';
import { updateHash } from '@/lib/utils/url';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CommandBarProps {
  selectedApps: App[];
  platform: Platform;
}

export function CommandBar({ selectedApps, platform }: CommandBarProps) {
  const [showFullScript, setShowFullScript] = React.useState(false);
  const command = React.useMemo(() => generateCommand(selectedApps, platform), [selectedApps, platform]);
  const fullScript = React.useMemo(() => generateScriptContent(selectedApps, platform), [selectedApps, platform]);
  const totalSize = React.useMemo(() => getTotalSize(selectedApps), [selectedApps]);
  const platformName = React.useMemo(() => getPlatformDisplayName(platform), [platform]);

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

  const handleCopyScript = async () => {
    if (!fullScript) return;
    await navigator.clipboard.writeText(fullScript);
    toast.success('Full script copied to clipboard');
  };

  if (selectedApps.length === 0) {
    return (
      <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-7xl items-center px-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 opacity-50" />
            Select apps to generate installation command
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
                {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {platformName} • Total size: ~{formatSize(totalSize)}
              </span>
            </div>
            <Button
              onClick={() => setShowFullScript(!showFullScript)}
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
            >
              {showFullScript ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show command only
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show full script
                </>
              )}
            </Button>
          </div>

          {/* Command Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Terminal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  readOnly
                  value={showFullScript ? fullScript : command}
                  className={showFullScript
                    ? "min-h-[200px] max-h-[300px] resize-none font-mono text-xs pl-10 py-3"
                    : "h-16 sm:h-20 resize-none font-mono text-xs pl-10"
                  }
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.select();
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 sm:self-center">
              <Button
                onClick={showFullScript ? handleCopyScript : handleCopy}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
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
