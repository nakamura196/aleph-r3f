'use client';

import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function ArrowHelpersSelector() {
  const { arrowHelpersEnabled, setArrowHelpersEnabled } = useStore();

  return (
    <BooleanSelector
      label="Arrow Helpers"
      description="Enabled/disable arrow helpers."
      value={arrowHelpersEnabled}
      onChange={setArrowHelpersEnabled}
    />
  );
}
