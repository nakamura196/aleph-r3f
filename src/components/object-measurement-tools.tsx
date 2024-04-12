import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useStore from '@/Store';
import { Intersection, Object3D, Object3DEventMap, Vector3 } from 'three';
import { useEventTrigger } from '@/lib/hooks/use-event';
import { ObjectMeasurement, CAMERA_CONTROLS_ENABLED } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { cn } from '@/lib/utils';
import { useDrag } from '@use-gesture/react';

export function ObjectMeasurementTools() {
  const { objectMeasurements: measurements, setObjectMeasurements: setMeasurements, measurementUnits } = useStore();
  const { scene, camera, pointer, raycaster, size } = useThree();

  // if a dot product is less than this, then the normal is facing away from the camera
  const DOT_PRODUCT_THRESHOLD = Math.PI * -0.1;

  const dragRef = useRef<number | null>(null);

  const v1 = new Vector3();

  function isFacingCamera(measurement: ObjectMeasurement): boolean {
    const cameraDirection: Vector3 = camera.position.clone().normalize().sub(measurement.position.clone().normalize());
    const dotProduct: number = cameraDirection.dot(measurement.normal);

    if (dotProduct < DOT_PRODUCT_THRESHOLD) {
      return false;
    }

    return true;
  }

  function updatePointPosition(idx: number, x: number, y: number) {
    const measurementEl: HTMLElement = document.getElementById(`point-${idx}`)!;

    if (measurementEl) {
      measurementEl.setAttribute('transform', `translate(${x}, ${y})`);
    } else {
      console.error('could not find element');
    }
  }

  function updatePointPositions() {
    measurements.forEach((measurement: ObjectMeasurement, idx: number) => {
      // if not dragging the annotation, update its position
      if (dragRef.current !== idx) {
        const [x, y] = calculateScreenPosition(measurement.position);
        updatePointPosition(idx, x, y);
      }
    });
  }

  function checkPointsFacingCamera() {
    // loop through all measurements and check if their normals
    // are facing towards or away from the camera

    measurements.forEach((measurement: ObjectMeasurement, idx: number) => {
      const measurementEl: HTMLElement = document.getElementById(`point-${idx}`)!;

      if (measurementEl) {
        if (isFacingCamera(measurement)) {
          measurementEl.classList.remove('facing-away');
        } else {
          measurementEl.classList.add('facing-away');
        }
      }
    });
  }

  function updateRulerPositions() {
    const lineEls = document.getElementsByClassName('ruler-line');

    const points = document.getElementsByClassName('point');

    for (let i = 0; i < points.length; i++) {
      const point = points[i] as HTMLElement;
      const idx = Number(point.getAttribute('data-idx'));
      const translateValues = getTranslateValues(point);

      // for each lineEl, update the x1, y1, x2, y2 attributes using the data-idx0 and data-idx1 attributes
      for (let j = 0; j < lineEls.length; j++) {
        const lineEl = lineEls[j] as SVGLineElement;
        const idx0 = Number(lineEl.getAttribute('data-idx0'));
        const idx1 = Number(lineEl.getAttribute('data-idx1'));

        if (idx0 === idx) {
          lineEl.setAttribute('x1', String(translateValues![0]));
          lineEl.setAttribute('y1', String(translateValues![1]));
        } else if (idx1 === idx) {
          lineEl.setAttribute('x2', String(translateValues![0]));
          lineEl.setAttribute('y2', String(translateValues![1]));
        }
      }
    }

    // todo: update the position of the measurement-labels
    // this should always be happening on frame here, not when rendered
  }

  function getTranslateValues(el: HTMLElement): number[] | null {
    let x: number;
    let y: number;

    let transformValue = el.getAttribute('transform');
    let translateValues: string[] | null = null;

    if (transformValue) {
      let match = transformValue.match(/translate\(([^)]+)\)/);
      if (match) {
        translateValues = match[1].split(', ');
      }
    }

    if (translateValues) {
      x = Number(translateValues[0]);
      y = Number(translateValues[1]);

      return [x, y];
    }

    return null;
  }

  useFrame(() => {
    updatePointPositions();
    checkPointsFacingCamera();
    updateRulerPositions();
  });

  const triggerCameraControlsEnabledEvent = useEventTrigger(CAMERA_CONTROLS_ENABLED);

  const bind = useDrag((state) => {
    const el = state.currentTarget as HTMLDivElement;

    // get the element's index from the data-index attribute
    const idx = parseInt(el.getAttribute('data-idx')!);

    if (!isFacingCamera(measurements[idx])) {
      return;
    }

    let x;
    let y;

    if (!state.memo) {
      // just started dragging. use the initial position
      let translateValues = getTranslateValues(el);
      if (translateValues) {
        x = translateValues[0];
        y = translateValues[1];
      }
    } else {
      // continued dragging. use the memo'd initial position plus the movement
      x = state.memo[0] + state.movement[0];
      y = state.memo[1] + state.movement[1];

      // if the measurement has moved, set the dragRef to the index
      if (x !== state.memo[0] || y !== state.memo[1]) {
        dragRef.current = idx;
      }
    }

    // set element position without updating state (that happens on MouseUp event)
    updatePointPosition(idx, x, y);

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

  // https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx#L25
  function calculateScreenPosition(position: Vector3) {
    const objectPos = v1.copy(position);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
  }

  function getIntersects(): Intersection<Object3D<Object3DEventMap>>[] {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(scene.children, true);
  }

  function Ruler({ idx0, idx1, width = 2 }: { idx0: number; idx1: number; width?: number }) {
    const pos2D1: number[] = calculateScreenPosition(measurements[idx0].position);
    const pos2D2: number[] = calculateScreenPosition(measurements[idx1].position);

    const pos3D1: Vector3 = measurements[idx0].position;
    const pos3D2: Vector3 = measurements[idx1].position;

    let dir = pos3D2.clone().sub(pos3D1);
    let worldDistance = dir.length();

    if (measurementUnits === 'mm') {
      worldDistance *= 1000;
      // round to two decimal places
      worldDistance = Math.round(worldDistance);
    } else {
      // round to two decimal places
      worldDistance = parseFloat(worldDistance.toFixed(2));
    }

    const avgX = (pos2D1[0] + pos2D2[0]) / 2;
    const avgY = (pos2D1[1] + pos2D2[1]) / 2;

    return (
      <>
        <line
          className="ruler-line"
          data-idx0={idx0}
          data-idx1={idx1}
          x1={pos2D1[0]}
          y1={pos2D1[1]}
          x2={pos2D2[0]}
          y2={pos2D2[1]}
          stroke="black"
          strokeWidth={width}
          strokeDasharray="5,5"
        />
        <line
          className="ruler-line"
          data-idx0={idx0}
          data-idx1={idx1}
          x1={pos2D1[0]}
          y1={pos2D1[1]}
          x2={pos2D2[0]}
          y2={pos2D2[1]}
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

  // function calculateAngle(line1: any, line2: any) {
  //   // Calculate direction vectors
  //   const dir1 = { x: line1.x1 - line1.x2, y: line1.y1 - line1.y2 };
  //   const dir2 = { x: line2.x2 - line2.x1, y: line2.y2 - line2.y1 };

  //   // Calculate the dot product
  //   const dotProduct = dir1.x * dir2.x + dir1.y * dir2.y;

  //   // Calculate the magnitudes of the vectors
  //   const mag1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
  //   const mag2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);

  //   // Calculate the cosine of the angle
  //   const cosTheta = dotProduct / (mag1 * mag2);

  //   // Calculate the angle in radians
  //   let angleRadians = Math.acos(cosTheta);

  //   // Convert to degrees
  //   let angleDegrees = angleRadians * (180 / Math.PI);

  //   // Ensure the angle is not more than 180
  //   if (angleDegrees > 180) {
  //     angleDegrees = 360 - angleDegrees;
  //   }

  //   return angleDegrees;
  // }

  function calculateAngle(point1: Vector3, point2: Vector3, point3: Vector3) {
    // Create vectors
    const vector1 = new Vector3().subVectors(point2, point1);
    const vector2 = new Vector3().subVectors(point2, point3);

    // Normalize the vectors
    vector1.normalize();
    vector2.normalize();

    // Calculate the dot product of vector1 and vector2
    const dotProduct = vector1.dot(vector2);

    // Clamp the value of dotProduct between -1 and 1
    const clampedDotProduct = Math.max(-1, Math.min(1, dotProduct));

    // Calculate the angle in radians
    const angleRadians = Math.acos(clampedDotProduct);

    // Convert the angle to degrees
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
  }

  function Angle({ point1, point2, point3 }: { point1: Vector3; point2: Vector3; point3: Vector3 }) {
    const pos2D1: number[] = calculateScreenPosition(point1);
    const pos2D2: number[] = calculateScreenPosition(point2);
    const pos2D3: number[] = calculateScreenPosition(point3);

    const line1 = {
      x1: pos2D1[0],
      y1: pos2D1[1],
      x2: pos2D2[0],
      y2: pos2D2[1],
    };

    const line2 = {
      x1: pos2D2[0],
      y1: pos2D2[1],
      x2: pos2D3[0],
      y2: pos2D3[1],
    };

    // Calculate the angle between the three points
    const angle = calculateAngle(point1, point2, point3);

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

    return (
      <>
        <foreignObject className="angle-label" x={textPosition.x - 30} y={textPosition.y - 15}>
          <div>{angle.toFixed(2)}°</div>
        </foreignObject>
      </>
    );
  }

  return (
    <Html
      zIndexRange={[50, 0]}
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
        onDoubleClick={(_e: React.MouseEvent<SVGElement>) => {
          const intersects: Intersection<Object3D>[] = getIntersects();

          if (intersects.length > 0) {
            setMeasurements([
              ...measurements,
              {
                position: intersects[0].point,
                normal: intersects[0].face?.normal!,
              },
            ]);

            // setSelectedMeasurement(measurement.length);
          }
        }}>
        {/* draw rulers */}
        {measurements.map((_measurement: ObjectMeasurement, index: number) => {
          // const nextPosition = measurements[index + 1]?.position;
          if (index < measurements.length - 1) {
            return <Ruler key={index} idx0={index} idx1={index + 1} />;
          }
          return null;
        })}
        {/* draw angles */}
        {measurements.map((_measurement: ObjectMeasurement, index: number) => {
          if (!measurements[index + 2]) {
            return null;
          }

          return (
            <Angle
              key={index}
              point1={measurements[index].position}
              point2={measurements[index + 1].position}
              point3={measurements[index + 2].position}
            />
          );
        })}
        {/* draw points */}
        {measurements.map((measurement: ObjectMeasurement, index: number) => {
          return (
            <React.Fragment key={index}>
              <g
                {...bind()}
                id={`point-${index}`}
                data-idx={index}
                className={cn('point', {
                  // selected: selectedMeasurement === index,
                })}
                onMouseDown={(_e: React.MouseEvent<SVGElement>) => {
                  if (isFacingCamera(measurement)) {
                    triggerCameraControlsEnabledEvent(false);
                  }
                }}
                onMouseUp={(_e: React.MouseEvent<SVGElement>) => {
                  if (isFacingCamera(measurement)) {
                    // if was dragging this annotation
                    if (dragRef.current === index) {
                      const intersects: Intersection<Object3D>[] = getIntersects();

                      if (intersects.length > 0) {
                        // update annotation position
                        setMeasurements(
                          measurements.map((measurement: ObjectMeasurement, idx: number) => {
                            if (idx === index) {
                              return {
                                ...measurement,
                                position: intersects[0].point,
                                normal: intersects[0].face?.normal!,
                              };
                            }
                            return measurement;
                          })
                        );
                      }

                      dragRef.current = null;
                    } else {
                      // setSelectedMeasurement(index);
                    }

                    triggerCameraControlsEnabledEvent(true);
                  }
                }}>
                <circle r="8" />
              </g>
            </React.Fragment>
          );
        })}
      </svg>
    </Html>
  );
}
