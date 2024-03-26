'use client';

import useStore from '@/Store';
import { SliderSelector } from './slider-selector';

export function AmbientLightSelector() {
  const { ambientLightIntensity, setAmbientLightIntensity } = useStore();

  return (
    <SliderSelector
      label="Ambient Light"
      description="Controls the level of ambient light in the scene."
      value={ambientLightIntensity}
      onChange={setAmbientLightIntensity}
    />
  );
}
