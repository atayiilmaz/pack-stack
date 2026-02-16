'use client';

import * as React from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { osOptions, linuxDistros, OSSelect, getInstallMethodForOS } from '@/lib/data/os';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OSSelectorProps {
  value: string;
  onChange: (osId: string) => void;
}

export function OSSelector({ value, onChange }: OSSelectorProps) {
  const selectedOS = React.useMemo(() => {
    return [...osOptions, ...linuxDistros].find((os) => os.id === value);
  }, [value]);

  const handleSelect = (osId: string) => {
    onChange(osId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between gap-2 min-w-[180px]">
          <span className="flex items-center gap-2">
            {selectedOS?.icon && (
              <img
                src={selectedOS.icon}
                alt={selectedOS.name}
                className="h-4 w-4"
              />
            )}
            <span>{selectedOS?.name || 'Select OS'}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {osOptions.map((os) => (
          <div key={os.id}>
            <DropdownMenuItem
              onClick={() => handleSelect(os.id)}
              className="gap-2 cursor-pointer"
            >
              <img src={os.icon} alt={os.name} className="h-4 w-4" />
              <span>{os.name}</span>
              {value === os.id && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            {/* Show Linux distros as submenu when Linux is selected */}
            {os.id === 'linux' && (
              <>
                <DropdownMenuSeparator />
                {linuxDistros.map((distro) => (
                  <DropdownMenuItem
                    key={distro.id}
                    onClick={() => handleSelect(distro.id)}
                    className="gap-2 pl-8 cursor-pointer"
                  >
                    <img src={distro.icon} alt={distro.name} className="h-4 w-4" />
                    <span>{distro.name}</span>
                    {value === distro.id && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
