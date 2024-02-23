import useStore from '@/Store';
import { DBL_CLICK, DRAGGING_MEASUREMENT, DROPPED_MEASUREMENT, Measurement } from '@/types';
import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useEventListener, useEventTrigger } from '@/lib/hooks/use-event';
import { useThree } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { useDrag } from '@use-gesture/react';
import { areObjectsIdentical } from '@/lib/utils';

// export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
export function MeasurementTools() {
  const { measurements, setMeasurements, cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  const measurementPointAbsPositionsRef = useRef<[number, number][]>([]);

  const prevMeasurementsRef = useRef(measurements);

  useEffect(() => {
    // need to wait a tick for the measurement points to be rendered
    setTimeout(() => {
      const measurementPointDivs = document.getElementsByClassName('measurement-point');
      const measurementPointPositions: [number, number][] = Array.from(measurementPointDivs).map((div: any) => {
        const transform = div.parentNode.style.transform;
        const regex = /translate3d\((\d+(?:\.\d+)?)px,\s*(\d+(?:\.\d+)?)px,/;
        const match = transform.match(regex);

        if (match) {
          const x = parseFloat(match[1]);
          const y = parseFloat(match[2]);
          return [x, y];
        }

        return [0, 0];
      });

      measurementPointAbsPositionsRef.current = measurementPointPositions;

      const newMeasurements = measurements.map((measurement, idx) => {
        return {
          ...measurement,
          absPosition: measurementPointPositions[idx],
        };
      });

      // Only update measurements if they have changed, otherwise it will cause an infinite loop
      if (!areObjectsIdentical(newMeasurements, prevMeasurementsRef.current)) {
        setMeasurements(newMeasurements);
        prevMeasurementsRef.current = newMeasurements;
      }
    }, 1);
  }, [measurements]);

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
          id={`measurement-${index}`}
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

  function RulerLine({
    position,
    nextPosition,
    width = 2,
    ticksCount = 10,
  }: {
    position: [number, number];
    nextPosition: [number, number];
    width?: number;
    ticksCount?: number;
  }) {
    const dx = nextPosition[0] - position[0];
    const dy = nextPosition[1] - position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const tickSpacing = distance / ticksCount;
    const tickLength = width;

    const ticks = Array.from({ length: ticksCount }, (_, i) => {
      const x = position[0] + i * tickSpacing * Math.cos(angle);
      const y = position[1] + i * tickSpacing * Math.sin(angle) - tickLength / 2; // adjust the y-coordinate
      const xEnd = x + tickLength * Math.sin(angle);
      const yEnd = y - tickLength * Math.cos(angle);
      return { x1: x, y1: y, x2: xEnd, y2: yEnd };
    });

    const avgX = (position[0] + nextPosition[0]) / 2;
    const avgY = (position[1] + nextPosition[1]) / 2;

    return (
      <svg>
        <line
          x1={position[0]}
          y1={position[1]}
          x2={nextPosition[0]}
          y2={nextPosition[1]}
          stroke="white"
          strokeWidth={width}
        />
        {ticks.map((tick, index) => (
          <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke="black" strokeWidth="1" />
        ))}
        <foreignObject x={avgX - 35} y={avgY - 35} width="70" height="32">
          <div style={{ backgroundColor: 'white', padding: '2px', textAlign: 'center' }}>
            <span style={{ color: 'black', fontSize: '16px' }}>{distance.toFixed(2)}</span>
          </div>
        </foreignObject>
      </svg>
    );
  }

  function MeasurementConnections() {
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
          {measurementPointAbsPositionsRef.current.map((position, index) => {
            const nextPosition = measurementPointAbsPositionsRef.current[index + 1];
            if (nextPosition) {
              return <RulerLine key={index} position={position} nextPosition={nextPosition} />;
              // return (
              //   <line
              //     key={index}
              //     x1={position[0]}
              //     y1={position[1]}
              //     x2={nextPosition[0]}
              //     y2={nextPosition[1]}
              //     stroke="white"
              //     strokeWidth="4"
              //   />
              // );
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
