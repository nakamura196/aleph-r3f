'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function AxesSelector() {
  const { axesEnabled, setAxesEnabled } = useStore();

  return (
    <BooleanSelector
      label="Axes"
      description="Enabled/disable scene axes."
      value={axesEnabled}
      onChange={setAxesEnabled}
    />
  );
}
