import useStore from '@/Store';
import { DRAGGING_MEASUREMENT, DROPPED_MEASUREMENT, Measurement } from '@/types';
import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useEventTrigger } from '@/lib/hooks/use-event';
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
    const triggerDraggingMeasurementEvent = useEventTrigger(DRAGGING_MEASUREMENT);
    const triggerDroppedMeasurementEvent = useEventTrigger(DROPPED_MEASUREMENT);

    const bind = useDrag((state) => {
      if (cameraControlsEnabled) {
        return;
      }

      triggerDraggingMeasurementEvent();

      const el = state.currentTarget as SVGElement;

      // get the element's index from the data-index attribute
      // const index = parseInt(el.getAttribute('data-index')!);

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
            setCameraControlsEnabled(false);

            const mousePos: [number, number] = getSVGMousePosition(e);

            setMeasurements([
              ...measurements,
              {
                position: mousePos,
              },
            ]);
          }}>
          {/* draw connections */}
          {measurements.map((measurement: Measurement, index: number) => {
            const nextPosition = measurements[index + 1]?.position;
            if (nextPosition) {
              return <RulerLine key={index} position={measurement.position} nextPosition={nextPosition} />;
            }
            return null;
          })}
          {/* draw points */}
          {measurements.map((measurement: Measurement, index: number) => (
            <circle
              {...bind()}
              key={index}
              data-index={index}
              cx={measurement.position[0]}
              cy={measurement.position[1]}
              r="8"
              fill="white"
              onMouseUp={(e: React.MouseEvent<SVGElement>) => {
                if (cameraControlsEnabled) {
                  return;
                }

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

  return (
    <>
      <MeasurementConnections />
    </>
  );
}

export default MeasurementTools;
