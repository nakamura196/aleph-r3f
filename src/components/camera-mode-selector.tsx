'use client';

import useStore from '@/Store';
import { OptionSelector } from './option-selector';
import { CameraMode } from '@/types';

export function CameraModeSelector() {
  const { cameraMode, measurementMode, mode, setCameraMode } = useStore();
 
  const handleChange = (value: string) => {
    setCameraMode(value as CameraMode);
  };

  return (
    <OptionSelector
      label="Camera Type"
      description="Set the type of camera."
      value={cameraMode}
      onChange={handleChange}
      options={[
        { value: 'perspective', label: 'Perspective' },
        { value: 'orthographic', label: 'Orthographic' },
      ]}
      disabled={mode === 'measurement' && measurementMode === 'screen'}
    />
  );
}
