import { useEventTrigger } from '@/lib/hooks/use-event';
import { MeasurementModeSelector } from './measurement-mode-selector';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER } from '@/types';
import { Instructions } from './instructions';
import { useEffect } from 'react';
import useStore from '@/Store';

function MeasurementTab() {
  const { measurementMode, setCameraMode } = useStore();

  const triggerRecenterEvent = useEventTrigger(RECENTER);

  useEffect(() => {
    if (measurementMode === 'screen') setCameraMode('orthographic');
  }, []);

  return (
    <Tab>
      <Instructions>Double-click to create measurements.</Instructions>
      <MeasurementModeSelector />
      <MeasurementUnitsSelector />
      <Button
        className="text-white mt-6"
        onClick={() => {
          triggerRecenterEvent();
        }}>
        Recenter
      </Button>
    </Tab>
  );
}

export default MeasurementTab;
