'use client';

import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import useStore from '@/Store';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function GridSelector() {
  const { gridEnabled, setGridEnabled } = useStore();

  return (
    <div className="grid gap-4 pt-4">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient-light" className="text-white">
                Grid
              </Label>
            </div>
            <div className="grid gap-4">
              <Switch
                checked={gridEnabled}
                onCheckedChange={(checked: boolean) => {
                  setGridEnabled(checked);
                }}
              />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Enabled/disable grid.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
