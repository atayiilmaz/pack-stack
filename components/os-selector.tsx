'use client';

import * as React from 'react';
import { Check, Terminal, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { osOptions, linuxDistros, getOSInfo } from '@/lib/data/os';
import { cn } from '@/lib/utils';

interface OSSelectorProps {
  value: string;
  onChange: (osId: string) => void;
}

export function OSSelector({ value, onChange }: OSSelectorProps) {
  const [expandedLinux, setExpandedLinux] = React.useState(false);

  const isSelected = (osId: string) => value === osId;
  const isLinuxSelected = value === 'linux' || linuxDistros.some(d => d.id === value);

  const handleSelect = (osId: string) => {
    if (osId === 'linux') {
      setExpandedLinux(!expandedLinux);
    } else {
      onChange(osId);
    }
  };

  const isLinuxParentSelected = () => {
    return isLinuxSelected && !linuxDistros.some(d => d.id === value);
  };

  const selectedOS = getOSInfo(value);

  return (
    <div className="w-full">
      {/* Main OS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {osOptions.map((os, index) => {
          const selected = os.id === 'linux' ? isLinuxParentSelected() : isSelected(os.id);
          const isLinux = os.id === 'linux';
          const showExpand = isLinux && linuxDistros.some(d => d.id === value);

          return (
            <button
              key={os.id}
              onClick={() => handleSelect(os.id)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 transition-all duration-500',
                'hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]',
                'min-h-[160px] sm:min-h-[180px]',
                selected
                  ? 'border-shadow bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                borderColor: selected ? os.color : undefined,
              }}
            >
              {/* Animated Background Gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${os.color}15, transparent 70%)`,
                }}
              />

              {/* Selection Badge */}
              {selected && (
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full shadow-lg animate-pulse"
                    style={{ backgroundColor: os.color }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative p-6 flex flex-col items-center justify-center h-full gap-4">
                {/* Icon with glow effect */}
                <div className="relative">
                  <div
                    className={cn(
                      'flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl transition-all duration-500',
                      selected
                        ? 'shadow-xl scale-110 bg-white'
                        : 'group-hover:scale-105 group-hover:shadow-lg'
                    )}
                    style={{
                      backgroundColor: selected ? '#ffffff' : `${os.color}15`,
                    }}
                  >
                    <img
                      src={os.icon}
                      alt={os.name}
                      className={cn(
                        'h-10 w-10 sm:h-12 sm:w-12 drop-shadow-sm transition-transform duration-300 object-contain',
                        selected ? 'scale-110' : 'group-hover:scale-105'
                      )}
                    />
                  </div>
                  {/* Glow effect */}
                  {selected && (
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse"
                      style={{ backgroundColor: os.color }}
                    />
                  )}
                </div>

                {/* Name & Description */}
                <div className="text-center space-y-1">
                  <span
                    className={cn(
                      'text-lg sm:text-xl font-bold transition-colors block',
                      selected ? 'text-primary' : 'text-foreground'
                    )}
                    style={{ color: selected ? os.color : undefined }}
                  >
                    {os.name}
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3" />
                    <span>{os.description}</span>
                  </div>
                  {isLinux && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {showExpand
                          ? linuxDistros.find(d => d.id === value)?.name || 'Select distro'
                          : `${linuxDistros.length} distributions available`
                        }
                      </span>
                      {showExpand ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Command Preview */}
              {selected && !isLinux && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent">
                  <code className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <Terminal className="h-3 w-3" />
                    {os.command}
                  </code>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected OS Info */}
      {selectedOS && value !== 'linux' && (
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: `${selectedOS.color}15` }}>
              <img src={selectedOS.icon} alt={selectedOS.name} className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">Installing for {selectedOS.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your installation command will use <code className="font-mono bg-background px-1.5 py-0.5 rounded">{selectedOS.command}</code>
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>All apps from official sources</span>
            </div>
          </div>
        </div>
      )}

      {/* Linux Distros Expansion */}
      {(expandedLinux || isLinuxSelected) && (
        <div className="mt-6 animate-slide-down">
          <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Terminal className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Choose your Linux distribution</p>
                <p className="text-xs text-muted-foreground">Each uses its native package manager</p>
              </div>
            </div>

            {/* Distro Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {linuxDistros.map((distro) => {
                const selected = isSelected(distro.id);

                return (
                  <button
                    key={distro.id}
                    onClick={() => onChange(distro.id)}
                    className={cn(
                      'group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200',
                      'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]',
                      selected
                        ? 'border-shadow bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                        : 'border-border bg-card hover:border-primary/30'
                    )}
                    style={{ borderColor: selected ? distro.color : undefined }}
                  >
                    {/* Selection Indicator */}
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full shadow"
                          style={{ backgroundColor: distro.color }}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                        selected ? 'shadow-lg scale-110 bg-white' : 'group-hover:scale-105'
                      )}
                      style={{
                        backgroundColor: selected ? '#ffffff' : `${distro.color}15`,
                      }}
                    >
                      <img
                        src={distro.icon}
                        alt={distro.name}
                        className={cn(
                          'h-7 w-7 transition-transform drop-shadow-sm object-contain'
                        )}
                      />
                    </div>

                    {/* Name & Command */}
                    <div className="text-center space-y-0.5">
                      <span className="text-xs font-semibold block" style={{ color: selected ? distro.color : undefined }}>
                        {distro.name}
                      </span>
                      <code className="text-[10px] text-muted-foreground font-mono">
                        {distro.command.split(' ')[1]}
                      </code>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back Button */}
            <button
              onClick={() => onChange('linux')}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Use generic Linux commands
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
