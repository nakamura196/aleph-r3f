'use client';

import useStore from '@/Store';
import { OptionSelector } from './option-selector';
import { MeasurementMode } from '@/types';

export function MeasurementModeSelector() {
  const { measurementMode, setMeasurementMode } = useStore();

  return (
    <OptionSelector
      label="Measurement Mode"
      value={measurementMode}
      onChange={(value: string) => {
        setMeasurementMode(value as MeasurementMode);
      }}
      options={[
        { value: 'object', label: 'Object' },
        { value: 'screen', label: 'Screen' },
      ]}
      description="Set the measurement mode."
    />
  );
}
