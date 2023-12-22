'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function GridSelector() {
  const { gridEnabled, setGridEnabled } = useStore();

  return (
    <BooleanSelector label="Grid" description="Enabled/disable grid." value={gridEnabled} onChange={setGridEnabled} />
  );
}
