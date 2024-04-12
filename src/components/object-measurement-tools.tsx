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
  const { objectMeasurements: measurements, setObjectMeasurements: setMeasurements } = useStore();
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

  function updateMeasurementPosition(idx: number, x: number, y: number) {
    const measurementEl: HTMLElement = document.getElementById(`point-${idx}`)!;

    if (measurementEl) {
      measurementEl.setAttribute('transform', `translate(${x}, ${y})`);
    } else {
      console.error('could not find element');
    }
  }

  function updateMeasurementPositions() {
    measurements.forEach((measurement: ObjectMeasurement, idx: number) => {
      // if not dragging the annotation, update its position
      if (dragRef.current !== idx) {
        const [x, y] = calculatePosition(measurement);
        updateMeasurementPosition(idx, x, y);
      }
    });
  }

  function checkMeasurementsFacingCamera() {
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

  useFrame(() => {
    updateMeasurementPositions();
    checkMeasurementsFacingCamera();
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
    updateMeasurementPosition(idx, x, y);

    // memo the initial position
    if (!state.memo) {
      return [x, y];
    } else {
      return state.memo;
    }
  });

  // https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx#L25
  function calculatePosition(measurement: ObjectMeasurement) {
    const objectPos = v1.copy(measurement.position);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
  }

  function getIntersects(): Intersection<Object3D<Object3DEventMap>>[] {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(scene.children, true);
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
