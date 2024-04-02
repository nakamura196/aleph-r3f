import { useEventTrigger } from '@/lib/hooks/use-event';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER } from '@/types';
import { Instructions } from './instructions';
import { useEffect } from 'react';

function MeasurementTab() {
  const triggerRecenterEvent = useEventTrigger(RECENTER);

  useEffect(() => {
    setTimeout(() => {
      triggerRecenterEvent();
    }, 100);
  }, []);

  return (
    <Tab>
      <Instructions>Double-click to create measurements.</Instructions>
      <MeasurementUnitsSelector />
      <Button
        className="text-white mt-6"
        variant={'secondary'}
        onClick={() => {
          triggerRecenterEvent();
        }}>
        Recenter
      </Button>
    </Tab>
  );
}

export default MeasurementTab;
