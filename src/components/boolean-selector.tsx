'use client';

import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function BooleanSelector({ label, description, value, onChange }: {
    label: string;
    description: string;
    value: boolean;
    onChange: (checked: boolean) => void;
}) {
  return (
    <div className="grid gap-4 pt-4">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient-light" className="text-white">
                {label}
              </Label>
            </div>
            <div className="grid gap-4">
              <Switch
                checked={value}
                onCheckedChange={(checked: boolean) => {
                  onChange(checked);
                }}
              />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          {description}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
