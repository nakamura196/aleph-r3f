'use client';

import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import useStore from '@/Store';
import { Switch } from './ui/switch';

export function BoundsSelector() {
  const { boundsEnabled, setBoundsEnabled } = useStore();

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <Switch
              checked={boundsEnabled}
              onCheckedChange={(checked: boolean) => {
                setBoundsEnabled(checked);
              }}
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Enabled/disable bounding box.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
