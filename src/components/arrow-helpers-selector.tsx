'use client';

import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import useStore from '@/Store';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function ArrowHelpersSelector() {
  const { arrowHelpersEnabled, setArrowHelpersEnabled } = useStore();

  return (
    <div className="grid gap-4 pt-4">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="arrow-helpers" className="text-white">
                Arrow Helpers
              </Label>
            </div>
            <div className="grid gap-4">
              <Switch
                checked={arrowHelpersEnabled}
                onCheckedChange={(checked: boolean) => {
                  setArrowHelpersEnabled(checked);
                }}
              />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Enabled/disable arrow helpers.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
