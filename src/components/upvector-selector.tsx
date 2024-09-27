'use client';

import useStore from '@/Store';
import { OptionSelector } from './option-selector';
import { UpVector } from '@/types';

export function UpVectorSelector() {
  const { upVector, setUpVector } = useStore();
 
  const handleChange = (value: string) => {
    setUpVector(value as UpVector);
  };

  return (
    <OptionSelector
      label="Orientation"
      description="Set the rotational up vector."
      value={upVector}
      onChange={handleChange}
      options={[
        { value: 'y-positive', label: 'Default (Y+ Up)' },
        { value: 'y-negative', label: 'Upside Down (Y- Up)' },
        { value: 'z-positive', label: 'Flipped 90° (Z+ Up)' },
        { value: 'z-negative', label: 'Flipped 270° (Z- Up)' },
      ]}
    />
  );
}
