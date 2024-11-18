'use client';

import useStore from '@/Store';
import { OptionSelector } from './option-selector';
import { UpVector } from '@/types';

export function OrientationSelector() {
  const { orientation, setOrientation } = useStore();
 
  const handleChange = (value: string) => {
    setOrientation(value as UpVector);
  };

  return (
    <OptionSelector
      label="Orientation"
      description="Set the orientation or rotation of the model(s) in space."
      value={orientation}
      onChange={handleChange}
      options={[
        { value: 'y-positive', label: 'Default (Y+ Up)' },
        { value: 'y-negative', label: 'Upside Down (Y- Up)' },
        { value: 'z-negative', label: 'Forward 90° (Z- Up)' },
        { value: 'z-positive', label: 'Back 90° (Z+ Up)' },
      ]}
    />
  );
}
