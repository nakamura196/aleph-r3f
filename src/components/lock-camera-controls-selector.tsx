'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function LockCameraControlsSelector() {
  const { cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  return (
    <BooleanSelector
      label="Lock Rotation"
      description="Locks/unlocks camera controls to enable measurement."
      value={!cameraControlsEnabled}
      onChange={(value: boolean) => {
        setCameraControlsEnabled(!value);
      }}
    />
  );
}
