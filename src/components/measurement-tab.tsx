// import useStore from '@/Store';
import { useEventTrigger } from '@/lib/hooks/use-event';
import { LockCameraControlsSelector } from './lock-camera-controls-selector';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER_CLICK } from '@/types';
import useStore from '@/Store';

function MeasurementTab() {
  const { setCameraControlsEnabled, selectedMeasurement } = useStore();
  const triggerRecenterClickEvent = useEventTrigger(RECENTER_CLICK);
  return (
    <Tab>
      <LockCameraControlsSelector />
      <MeasurementUnitsSelector />
      <Button
        className="text-white"
        variant={'secondary'}
        onClick={() => {
          setCameraControlsEnabled(true);
          triggerRecenterClickEvent();
        }}>
        Recenter
      </Button>
      {selectedMeasurement}
    </Tab>
  );
}

export default MeasurementTab;
