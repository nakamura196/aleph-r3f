import useStore from '@/Store';
import { CameraRefs, Measurement } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';

export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { measurements, setMeasurements } = useStore();

  return (
    <>
      {measurements.map((measurement: Measurement, idx: number) => {
        return (
          <React.Fragment key={idx}>
            {/* {arrowHelpersEnabled && <arrowHelper args={[anno.normal, anno.position, 0.05, 0xffffff]} />} */}
            <Html
              position={measurement.position}
              style={{
                width: 0,
                height: 0,
              }}>
              <div id={`anno-${idx}`} className="annotation">
                <div
                  className="circle"
                  onClick={(_e) => {
                    // triggerMeasurementClick(measurement);
                  }}>
                  <span className="label">{idx + 1}</span>
                </div>
              </div>
            </Html>
          </React.Fragment>
        );
      })}
    </>
  );
}

export default MeasurementTools;
