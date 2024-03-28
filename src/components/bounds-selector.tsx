'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function BoundsSelector() {
  const { boundsEnabled, setBoundsEnabled } = useStore();

  return (
    <BooleanSelector
      label="Bounding Box"
      description="Enable/disable bounding box."
      value={boundsEnabled}
      onChange={setBoundsEnabled}
    />
  );
}
