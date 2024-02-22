import useStore from '@/Store';
import { DBL_CLICK, DRAGGING_MEASUREMENT, DROPPED_MEASUREMENT, Measurement } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { useEventListener, useEventTrigger } from '@/lib/hooks/use-event';
import { useThree } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { useDrag } from '@use-gesture/react';

// export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
export function MeasurementTools() {
  const { measurements, setMeasurements, cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  const { camera, pointer, size } = useThree();

  // create annotation on double click
  const handleDoubleClickEvent = () => {
    setCameraControlsEnabled(false);

    setMeasurements([
      ...measurements,
      {
        position: [pointer.x, pointer.y],
      },
    ]);
  };

  useEventListener(DBL_CLICK, handleDoubleClickEvent);

  function sceneToScreenCoords(el: Object3D, coords: [number, number]) {
    const x = coords[0];
    const y = coords[1];
    const v1 = new Vector3();
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [x * widthHalf + widthHalf, -(y * heightHalf) + heightHalf];
  }

  const MeasurementPoint: React.FC<{
    index: number;
    measurement: Measurement;
  }> = ({ index, measurement }) => {
    const triggerDraggingMeasurementEvent = useEventTrigger(DRAGGING_MEASUREMENT);
    const triggerDroppedMeasurementEvent = useEventTrigger(DROPPED_MEASUREMENT);

    const bind = useDrag((state) => {
      if (cameraControlsEnabled) {
        return;
      }

      const div = state.currentTarget as HTMLDivElement;

      // set div position from offset
      div.style.left = `${state.offset[0]}px`;
      div.style.top = `${state.offset[1]}px`;

      triggerDraggingMeasurementEvent();
    });

    return (
      <Html
        className="measurement-point"
        calculatePosition={(el: Object3D) => {
          return sceneToScreenCoords(el, measurement.position);
        }}
        style={{
          width: 0,
          height: 0,
          zIndex: 10,
        }}>
        <div
          {...bind()}
          id={`anno-${index}`}
          className="annotation"
          onMouseDown={(event: React.MouseEvent) => {
            if (cameraControlsEnabled) {
              return;
            }
            // hide the measurement point otherwise the pointer coords will be off
            const div = event.currentTarget as HTMLDivElement;
            div.style.display = 'none';
          }}
          onMouseUp={(event: React.MouseEvent) => {
            if (cameraControlsEnabled) {
              return;
            }

            // why do you need to subtract 0.5 from x? anyway, it works!
            const upcoords: [number, number] = [pointer.x - 0.5, pointer.y];

            setMeasurements(
              measurements.map((measurement, idx) => {
                if (idx === index) {
                  return {
                    ...measurement,
                    position: upcoords,
                  };
                } else {
                  return measurement;
                }
              })
            );

            // show the measurement point
            const div = event.currentTarget as HTMLDivElement;
            div.style.display = 'block';

            triggerDroppedMeasurementEvent();
          }}
          style={{
            touchAction: 'none',
          }}>
          <div className="circle">
            <span className="label">{index + 1}</span>
          </div>
        </div>
      </Html>
    );
  };

  function MeasurementPoints() {
    return (
      <>
        {measurements.map((measurement, idx) => (
          <MeasurementPoint key={idx} index={idx} measurement={measurement} />
        ))}
      </>
    );
  }

  function MeasurementConnections() {
    // get all measurement point divs with classname measurement-point
    const measurementPointDivs = document.getElementsByClassName('measurement-point');

    // get all of the measurement point div positions as an array
    const measurementPointPositions = Array.from(measurementPointDivs).map((div: any) => {
      // get the transform translate values from the div
      const transform = div.parentNode.style.transform;
      // the transform value looks like this: translate3d(600px, 383px, 0px) scale(1)
      // get the translate values from the transform string
      const regex = /translate3d\((\d+(?:\.\d+)?)px,\s*(\d+(?:\.\d+)?)px,/;
      const match = transform.match(regex);

      if (match) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        return [x, y];
      }

      return [undefined, undefined];
    });

    // draw an svg line between each measurement point
    return (
      <Html
        calculatePosition={() => {
          return [0, 0];
        }}
        style={{
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}>
        <svg width="100vw" height="100vh">
          {measurementPointPositions.map((position, index) => {
            const nextPosition = measurementPointPositions[index + 1];
            if (nextPosition) {
              return (
                <line
                  key={index}
                  x1={position[0]}
                  y1={position[1]}
                  x2={nextPosition[0]}
                  y2={nextPosition[1]}
                  stroke="red"
                />
              );
            }
            return null;
          })}
        </svg>
      </Html>
    );

    // return (
    //   <>
    //     {measurements.map((measurement, idx) => {
    //       if (idx + 1 < measurements.length) {
    //         return (
    //           <MeasurementConnection key={idx} measurement={measurement} nextMeasurement={measurements[idx + 1]} />
    //         );
    //       }
    //       return null;
    //     })}
    //   </>
    // );
  }

  return (
    <>
      <MeasurementConnections />
      <MeasurementPoints />
    </>
  );
}

export default MeasurementTools;
