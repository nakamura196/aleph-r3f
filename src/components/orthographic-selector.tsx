'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function OrthographicSelector() {
  const { orthographicEnabled, setOrthographicEnabled } = useStore();

  return (
    <BooleanSelector
      label="Orthographic"
      description="Enabled/disable orthographic camera (no perspective)."
      value={orthographicEnabled}
      onChange={(value: boolean) => {
        setOrthographicEnabled(value);
      }}
    />
  );
}
