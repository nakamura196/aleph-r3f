// import useStore from '@/Store';
import { CameraControlsEnabledSelector } from './camera-controls-enabled-selector';
import { Tab } from './tab';

function MeasurementTab() {
  // const { measurements, setMeasurements } = useStore();

  return (
    <Tab>
      <CameraControlsEnabledSelector />
    </Tab>
  );
}

export default MeasurementTab;
