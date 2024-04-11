import useStore from '@/Store';
import { CAMERA_CONTROLS_ENABLED, DRAGGING_MEASUREMENT, DROPPED_MEASUREMENT, Measurement } from '@/types';
import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useEventTrigger } from '@/lib/hooks/use-event';
import { useDrag } from '@use-gesture/react';
import { useThree } from '@react-three/fiber';
import { cn } from '@/lib/utils';
import useKeyPress from '@/lib/hooks/use-key-press';

export function MeasurementTools() {
  const { measurements, setMeasurements, measurementUnits } = useStore();
  const { camera } = useThree();

  const triggerCameraControlsEnabledEvent = useEventTrigger(CAMERA_CONTROLS_ENABLED);

  // const handleCameraSleepEvent = (e: any) => {
  //   console.log('camera sleep event');
  // };

  // useEventListener(CAMERA_SLEEP, handleCameraSleepEvent);

  useKeyPress('Delete', () => {
    // delete measurement
    if (selectedMeasurementRef.current !== null) {
      setMeasurements(measurements.filter((_measurement, index) => index !== selectedMeasurementRef.current));
    }
    setSelectedMeasurement(measurements.length ? measurements.length - 2 : null);
  });

  const selectedMeasurementRef = useRef<number | null>(null);

  function setSelectedMeasurement(index: number | null) {
    selectedMeasurementRef.current = index;

    // find the selected measurement point and update class
    const measurementPointEls = document.getElementsByClassName('measurement-point');

    for (let i = 0; i < measurementPointEls.length; i++) {
      const pointEl = measurementPointEls[i] as SVGElement;
      pointEl.classList.remove('selected');

      if (index !== null && i === index) {
        pointEl.classList.add('selected');
      }
    }
  }

  function RulerLine({ idx0, idx1, width = 2 }: { idx0: number; idx1: number; width?: number }) {
    const position = measurements[idx0]?.position;
    const nextPosition = measurements[idx1]?.position;

    const dx = nextPosition[0] - position[0];
    const dy = nextPosition[1] - position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    let worldDistance = distance / camera.zoom;

    if (measurementUnits === 'mm') {
      worldDistance *= 1000;
      // round to two decimal places
      worldDistance = Math.round(worldDistance);
    } else {
      // round to two decimal places
      worldDistance = parseFloat(worldDistance.toFixed(2));
    }

    const avgX = (position[0] + nextPosition[0]) / 2;
    const avgY = (position[1] + nextPosition[1]) / 2;

    return (
      <>
        <line
          className="ruler-line"
          data-idx0={idx0}
          data-idx1={idx1}
          x1={position[0]}
          y1={position[1]}
          x2={nextPosition[0]}
          y2={nextPosition[1]}
          stroke="black"
          strokeWidth={width}
          strokeDasharray="5,5"
        />
        <line
          className="ruler-line"
          data-idx0={idx0}
          data-idx1={idx1}
          x1={position[0]}
          y1={position[1]}
          x2={nextPosition[0]}
          y2={nextPosition[1]}
          stroke="white"
          strokeWidth={width}
          strokeDasharray="5,5"
          strokeDashoffset="5"
        />
        <foreignObject className="measurement-label" x={avgX - 30} y={avgY - 15}>
          <div>
            {worldDistance}
            {measurementUnits}
          </div>
        </foreignObject>
      </>
    );
  }

  function Measurements() {
    const triggerDraggingMeasurementEvent = useEventTrigger(DRAGGING_MEASUREMENT);
    const triggerDroppedMeasurementEvent = useEventTrigger(DROPPED_MEASUREMENT);

    const bind = useDrag((state) => {
      triggerDraggingMeasurementEvent();

      const el = state.currentTarget as SVGElement;

      // get the element's index from the data-index attribute
      const idx = parseInt(el.getAttribute('data-idx')!);

      let x;
      let y;

      if (!state.memo) {
        // just started dragging. use the initial position
        x = Number(el.getAttribute('cx'));
        y = Number(el.getAttribute('cy'));
      } else {
        // continued dragging. use the memo'd initial position plus the movement
        x = state.memo[0] + state.movement[0];
        y = state.memo[1] + state.movement[1];
      }

      // set element position without updating state (that happens on MouseUp event)
      el.setAttribute('cx', String(x));
      el.setAttribute('cy', String(y));

      // update all connecting lines
      const lineEls = document.getElementsByClassName('ruler-line');

      // for each lineEl, update the x1, y1, x2, y2 attributes using the data-idx0 and data-idx1 attributes
      for (let i = 0; i < lineEls.length; i++) {
        const lineEl = lineEls[i] as SVGLineElement;
        const idx0 = Number(lineEl.getAttribute('data-idx0'));
        const idx1 = Number(lineEl.getAttribute('data-idx1'));

        if (idx0 === idx) {
          lineEl.setAttribute('x1', String(x));
          lineEl.setAttribute('y1', String(y));
        } else if (idx1 === idx) {
          lineEl.setAttribute('x2', String(x));
          lineEl.setAttribute('y2', String(y));
        }
      }

      // hide all measurement-labels
      const measurementLabelEls = document.getElementsByClassName('measurement-label');
      for (let i = 0; i < measurementLabelEls.length; i++) {
        const labelEl = measurementLabelEls[i] as SVGForeignObjectElement;
        labelEl.classList.add('hidden');
      }

      // hide all angle-labels
      const angleLabelEls = document.getElementsByClassName('angle-label');
      for (let i = 0; i < angleLabelEls.length; i++) {
        const labelEl = angleLabelEls[i] as SVGForeignObjectElement;
        labelEl.classList.add('hidden');
      }

      // memo the initial position
      if (!state.memo) {
        return [x, y];
      } else {
        return state.memo;
      }
    });

    function getSVGMousePosition(e: React.MouseEvent<SVGElement>): [number, number] {
      const parentNode = e.currentTarget.parentNode as HTMLElement;

      // get parentNode offset
      const rect = parentNode.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return [x, y];
    }

    function calculateAngle(line1: any, line2: any) {
      // Calculate direction vectors
      const dir1 = { x: line1.x1 - line1.x2, y: line1.y1 - line1.y2 };
      const dir2 = { x: line2.x2 - line2.x1, y: line2.y2 - line2.y1 };

      // Calculate the dot product
      const dotProduct = dir1.x * dir2.x + dir1.y * dir2.y;

      // Calculate the magnitudes of the vectors
      const mag1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
      const mag2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);

      // Calculate the cosine of the angle
      const cosTheta = dotProduct / (mag1 * mag2);

      // Calculate the angle in radians
      let angleRadians = Math.acos(cosTheta);

      // Convert to degrees
      let angleDegrees = angleRadians * (180 / Math.PI);

      // Ensure the angle is not more than 180
      if (angleDegrees > 180) {
        angleDegrees = 360 - angleDegrees;
      }

      return angleDegrees;
    }

    function Angle({ line1, line2 }: { line1: any; line2: any }) {
      // Calculate the angle
      const angle = calculateAngle(line1, line2);

      // Calculate the direction vectors of the lines
      const dir1 = { x: line1.x1 - line1.x2, y: line1.y1 - line1.y2 };
      const dir2 = { x: line2.x2 - line2.x1, y: line2.y2 - line2.y1 };

      // Normalize the direction vectors
      const magnitude1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
      const magnitude2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);
      const normDir1 = { x: dir1.x / magnitude1, y: dir1.y / magnitude1 };
      const normDir2 = { x: dir2.x / magnitude2, y: dir2.y / magnitude2 };

      // Calculate the midpoint of the normalized direction vectors
      const midDir = { x: (normDir1.x + normDir2.x) / 2, y: (normDir1.y + normDir2.y) / 2 };

      // Calculate the magnitude of the midpoint direction
      const midMagnitude = Math.sqrt(midDir.x * midDir.x + midDir.y * midDir.y);

      // Normalize the midpoint direction
      const normalizedMidDir = {
        x: midDir.x / midMagnitude,
        y: midDir.y / midMagnitude,
      };

      // Define the offset distance
      const offsetDistance = 50;

      // Calculate the position for the text
      const textPosition = {
        x: (line1.x2 + line2.x1) / 2 + normalizedMidDir.x * offsetDistance,
        y: (line1.y2 + line2.y1) / 2 + normalizedMidDir.y * offsetDistance,
      };

      //     // Calculate the radius of the semicircle
      //     const radius = offsetDistance;

      //     // Calculate the start and end points of the semicircle
      //     const semicircleStart = {
      //       x: line1.x2 - normalizedMidDir.x * radius,
      //       y: line1.y2 - normalizedMidDir.y * radius,
      //     };
      //     const semicircleEnd = {
      //       x: line2.x1 + normalizedMidDir.x * radius,
      //       y: line2.y1 + normalizedMidDir.y * radius,
      //     };

      //     // Define the path for the semicircle
      //     const semicirclePath = `
      //   M ${semicircleStart.x} ${semicircleStart.y}
      //   A ${radius} ${radius} 0 0 1 ${semicircleEnd.x} ${semicircleEnd.y}
      //   Z
      // `;

      return (
        <>
          {/* <line x1={line1.x1} y1={line1.y1} x2={line1.x2} y2={line1.y2} stroke="red" />
          <line x1={line2.x1} y1={line2.y1} x2={line2.x2} y2={line2.y2} stroke="red" /> */}
          {/* <circle cx={textPosition.x} cy={textPosition.y} r="5" fill="red" /> */}
          {/* <path d={semicirclePath} fill="red" stroke="red" /> */}
          <foreignObject className="angle-label" x={textPosition.x - 30} y={textPosition.y - 15}>
            <div>{angle.toFixed(2)}°</div>
          </foreignObject>
          {/* <text x={textPosition.x - offsetDistance / 2} y={textPosition.y + 5} fill="white">
            {angle.toFixed(2)}°
          </text> */}
        </>
      );
    }

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
        <svg
          width="100vw"
          height="100vh"
          onDoubleClick={(e: React.MouseEvent<SVGElement>) => {
            // setCameraControlsEnabled(false);

            const mousePos: [number, number] = getSVGMousePosition(e);

            setMeasurements([
              ...measurements,
              {
                position: mousePos,
              },
            ]);

            setSelectedMeasurement(measurements.length);
          }}>
          {/* draw connections */}
          {measurements.map((_measurement: Measurement, index: number) => {
            // const nextPosition = measurements[index + 1]?.position;
            if (index < measurements.length - 1) {
              return <RulerLine key={index} idx0={index} idx1={index + 1} />;
            }
            return null;
          })}
          {/* draw angles */}
          {measurements.map((_measurement: Measurement, index: number) => {
            if (index < measurements.length - 1) {
              const line1 = {
                x1: measurements[index].position[0],
                y1: measurements[index].position[1],
                x2: measurements[index + 1].position[0],
                y2: measurements[index + 1].position[1],
              };
              const line2 =
                index < measurements.length - 2
                  ? {
                      x1: measurements[index + 1].position[0],
                      y1: measurements[index + 1].position[1],
                      x2: measurements[index + 2].position[0],
                      y2: measurements[index + 2].position[1],
                    }
                  : null;

              if (line2) {
                return <Angle key={index} line1={line1} line2={line2} />;
              }
            }
          })}
          {/* draw points */}
          {measurements.map((measurement: Measurement, index: number) => (
            <circle
              {...bind()}
              key={index}
              data-idx={index}
              cx={measurement.position[0]}
              cy={measurement.position[1]}
              className={cn('measurement-point', {
                selected: selectedMeasurementRef.current === index,
              })}
              r="8"
              onMouseDown={(_e: React.MouseEvent<SVGElement>) => {
                triggerCameraControlsEnabledEvent(false);

                setSelectedMeasurement(index);
              }}
              onMouseUp={(e: React.MouseEvent<SVGElement>) => {
                triggerCameraControlsEnabledEvent(true);

                const mousePos: [number, number] = getSVGMousePosition(e);

                setMeasurements(
                  measurements.map((measurement, idx) => {
                    if (idx === index) {
                      return {
                        ...measurement,
                        position: mousePos,
                      };
                    } else {
                      return measurement;
                    }
                  })
                );

                triggerDroppedMeasurementEvent();
              }}
            />
          ))}
        </svg>
      </Html>
    );
  }

  return <Measurements />;
}

export default MeasurementTools;
