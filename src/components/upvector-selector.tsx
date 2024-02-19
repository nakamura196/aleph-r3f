'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function UpVectorSelector() {
  const { upVector, setUpVector } = useStore();

  return (
    <BooleanSelector
      label="Z-Up"
      description="Set the rotational up vector to Z instead of Y."
      value={upVector[2] === 1 ? true : false}
      onChange={(value: boolean) => {
        if (value) {
          setUpVector([0, 0, 1]);
        } else {
          setUpVector([0, 1, 0]);
        }
      }}
    />
  );
}
