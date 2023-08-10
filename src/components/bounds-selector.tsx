'use client';

import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import useStore from '@/Store';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function BoundsSelector() {
  const { boundsEnabled, setBoundsEnabled } = useStore();

  return (
    <div className="grid gap-4 pt-4">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient-light" className="text-white">
                Bounding Box
              </Label>
            </div>
            <div className="grid gap-4">
              <Switch
                checked={boundsEnabled}
                onCheckedChange={(checked: boolean) => {
                  setBoundsEnabled(checked);
                }}
              />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Enabled/disable bounding box.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
