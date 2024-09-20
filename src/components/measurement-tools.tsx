import { ObjectMeasurementTools } from './object-measurement-tools';
import ScreenMeasurementTools from './screen-measurement-tools';
import useStore from '@/Store';

export function MeasurementTools() {
  const { measurementMode } = useStore();

  return (
    <>
      {measurementMode === 'object' && <ObjectMeasurementTools />}
      {measurementMode === 'screen' && <ScreenMeasurementTools />}
    </>
  );
}

export default MeasurementTools;
