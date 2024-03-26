'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function LockCameraControlsSelector() {
  const { cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  return (
    <BooleanSelector
      label="Lock Camera"
      description="Locks/unlocks camera controls."
      value={!cameraControlsEnabled}
      onChange={(value: boolean) => {
        setCameraControlsEnabled(!value);
      }}
    />
  );
}
