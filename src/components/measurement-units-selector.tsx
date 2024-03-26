'use client';

import useStore from '@/Store';
import { OptionSelector } from './option-selector';

export function MeasurementUnitsSelector() {
  const { measurementUnits, setMeasurementUnits } = useStore();

  return (
    <OptionSelector
      label="Measurement Units"
      value={measurementUnits}
      onChange={(value: string) => {
        setMeasurementUnits(value as 'm' | 'mm');
      }}
      options={[
        { value: 'm', label: 'Meters' },
        { value: 'mm', label: 'Millimeters' },
      ]}
      description="Set the measurement units to meters or millimeters."
    />
  );
}
