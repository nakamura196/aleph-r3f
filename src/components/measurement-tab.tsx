import { useEventTrigger } from '@/lib/hooks/use-event';
import { MeasurementModeSelector } from './measurement-mode-selector';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { OrthographicSelector } from './orthographic-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER } from '@/types';
import { Instructions } from './instructions';
import { useEffect } from 'react';
import useStore from '@/Store';

function MeasurementTab() {
  const { measurementMode, setOrthographicEnabled } = useStore();

  const triggerRecenterEvent = useEventTrigger(RECENTER);

  useEffect(() => {
    if (measurementMode === 'screen') setOrthographicEnabled(true);
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
      <OrthographicSelector disabled={measurementMode === 'screen'} />
    </Tab>
  );
}

export default MeasurementTab;
