'use client';

import * as React from 'react';
import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function BoundsSelector() {
  const { boundsEnabled, setBoundsEnabled } = useStore();

  return (
    <BooleanSelector label='Bounding Box' description='Enabled/disable bounding box.' value={boundsEnabled} onChange={setBoundsEnabled} />
  )
}
