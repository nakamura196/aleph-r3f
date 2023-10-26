'use client';

import * as React from 'react';
import useStore from '@/Store';
import { BooleanSelector } from './boolean-selector';

export function OrthographicSelector() {
  const { orthographicEnabled, setOrthographicEnabled } = useStore();

  return (
    <BooleanSelector label='Orthographic Camera' description='Enabled/disable orthographic camera.' value={orthographicEnabled} onChange={setOrthographicEnabled} />
  )
}
