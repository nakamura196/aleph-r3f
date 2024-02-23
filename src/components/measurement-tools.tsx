import useStore from '@/Store';
import { DRAGGING_MEASUREMENT, DROPPED_MEASUREMENT, Measurement } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { useEventTrigger } from '@/lib/hooks/use-event';
import { useDrag } from '@use-gesture/react';

// export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
export function MeasurementTools() {
  const { measurements, setMeasurements, cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  function RulerLine({ idx0, idx1, width = 2 }: { idx0: number; idx1: number; width?: number }) {
    const position = measurements[idx0]?.position;
    const nextPosition = measurements[idx1]?.position;

    const dx = nextPosition[0] - position[0];
    const dy = nextPosition[1] - position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    const avgX = (position[0] + nextPosition[0]) / 2;
    const avgY = (position[1] + nextPosition[1]) / 2;

    return (
      <svg>
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
          strokeDasharray="4 2"
        />
        <foreignObject className="measurement-label" x={avgX - 35} y={avgY - 35}>
          <div>
            <span>{distance.toFixed(2)}</span>
          </div>
        </foreignObject>
      </svg>
    );
  }

  function Measurements() {
    const triggerDraggingMeasurementEvent = useEventTrigger(DRAGGING_MEASUREMENT);
    const triggerDroppedMeasurementEvent = useEventTrigger(DROPPED_MEASUREMENT);

    const bind = useDrag((state) => {
      if (cameraControlsEnabled) {
        return;
      }

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
      const labelEls = document.getElementsByClassName('measurement-label');
      for (let i = 0; i < labelEls.length; i++) {
        const labelEl = labelEls[i] as SVGForeignObjectElement;
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
          {measurements.map((_measurement: Measurement, index: number) => {
            // const nextPosition = measurements[index + 1]?.position;
            if (index < measurements.length - 1) {
              return <RulerLine key={index} idx0={index} idx1={index + 1} />;
            }
            return null;
          })}
          {/* draw points */}
          {measurements.map((measurement: Measurement, index: number) => (
            <circle
              {...bind()}
              key={index}
              data-idx={index}
              cx={measurement.position[0]}
              cy={measurement.position[1]}
              className="measurement-point"
              r="8"
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
      <Measurements />
    </>
  );
}

export default MeasurementTools;
