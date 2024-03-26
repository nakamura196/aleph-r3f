// import useStore from '@/Store';
import { CameraControlsEnabledSelector } from './camera-controls-enabled-selector';
import { MeasurementUnitsSelector } from './measurement-units-selector';
import { Tab } from './tab';

function MeasurementTab() {
  return (
    <Tab>
      <CameraControlsEnabledSelector />
      <MeasurementUnitsSelector />
    </Tab>
  );
}

export default MeasurementTab;
