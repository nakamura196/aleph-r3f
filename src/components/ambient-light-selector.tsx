'use client';

import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import useStore from '@/Store';

export function AmbientLightSelector() {
  const { ambientLightIntensity, setAmbientLightIntensity } = useStore();

  return (
    <div className="grid gap-4 pt-4">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient-light" className="text-white">
                Ambient Light
              </Label>
              <span className="text-white w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {ambientLightIntensity}
              </span>
            </div>
            <Slider
              id="ambient-light"
              max={1}
              defaultValue={[ambientLightIntensity]}
              step={0.1}
              onValueChange={(value: number[]) => {
                setAmbientLightIntensity(value[0]);
              }}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Ambient Light"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Controls the level of ambient light in the scene.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
