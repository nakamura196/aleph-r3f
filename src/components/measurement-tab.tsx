// import useStore from '@/Store';
import { useEventTrigger } from '@/lib/hooks/use-event';
import { LockCameraControlsSelector } from './lock-camera-controls-selector';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER } from '@/types';
import useStore from '@/Store';
import { Instructions } from './instructions';
import useKeyPress from '@/lib/hooks/use-key-press';
import { useEffect } from 'react';

function MeasurementTab() {
  const { cameraControlsEnabled, setCameraControlsEnabled } = useStore();
  const triggerRecenterEvent = useEventTrigger(RECENTER);

  useKeyPress('l', () => {
    setCameraControlsEnabled(!cameraControlsEnabled);
  });

  useEffect(() => {
    setTimeout(() => {
      triggerRecenterEvent();
    }, 100);
  }, []);

  return (
    <Tab>
      <Instructions>Double-click to create measurements.</Instructions>
      <LockCameraControlsSelector />
      <MeasurementUnitsSelector />
      <Button
        className="text-white mt-6"
        variant={'secondary'}
        onClick={() => {
          setCameraControlsEnabled(true);
          triggerRecenterEvent();
        }}>
        Recenter
      </Button>
    </Tab>
  );
}

export default MeasurementTab;
