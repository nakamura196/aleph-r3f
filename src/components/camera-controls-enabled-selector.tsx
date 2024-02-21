'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function CameraControlsEnabledSelector() {
  const { cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  return (
    <BooleanSelector
      label="Camera Controls Enabled"
      description="Enabled/disable camera controls."
      value={cameraControlsEnabled}
      onChange={setCameraControlsEnabled}
    />
  );
}
