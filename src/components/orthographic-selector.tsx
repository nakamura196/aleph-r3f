'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function OrthographicSelector({
  disabled,
}: {
  disabled?: boolean;
}) {
  const { orthographicEnabled, setOrthographicEnabled } = useStore();

  return (
    <BooleanSelector
      label="Orthographic"
      description="Enable/disable orthographic camera (no perspective)."
      disabled={disabled as boolean}
      value={orthographicEnabled}
      onChange={(value: boolean) => {
        setOrthographicEnabled(value);
      }}
    />
  );
}
