import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useStore from '@/Store';
import { Euler, Intersection, Object3D, Object3DEventMap, Quaternion, Vector3 } from 'three';
import { useEventListener, useEventTrigger } from '@/lib/hooks/use-event';
import { ANNO_CLICK, Annotation, CAMERA_CONTROLS_ENABLED, CameraRefs } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { cn, getEulerFromOrientation } from '@/lib/utils';
import { useDrag } from '@use-gesture/react';

export function AnnotationTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { 
    annotations, 
    setAnnotations, 
    orientation,
    selectedAnnotation, 
    setSelectedAnnotation 
  } = useStore();
  const { scene, camera, pointer, raycaster, size } = useThree();

  // if a dot product is less than this, then the normal is facing away from the camera
  const DOT_PRODUCT_THRESHOLD = Math.PI * -0.1;

  const dragRef = useRef<number | null>(null);

  const v1 = new Vector3();

  function zoomToAnnotation(annotation: Annotation) {
    cameraRefs.controls.current!.setPosition(
      annotation.cameraPosition!.x,
      annotation.cameraPosition!.y,
      annotation.cameraPosition!.z,
      true
    );
    cameraRefs.controls.current!.setTarget(
      annotation.cameraTarget!.x,
      annotation.cameraTarget!.y,
      annotation.cameraTarget!.z,
      true
    );
  }

  const handleAnnotationClick = (e: any) => {
    zoomToAnnotation(e.detail);
  };

  useEventListener(ANNO_CLICK, handleAnnotationClick);

  const triggerAnnoClick = useEventTrigger(ANNO_CLICK);

  function updateAnnotationRotation(anno: Annotation, rotation: Euler): Annotation {
    // get inverted previous rotation
    const prevRotation = anno.rotation || new Euler(0, 0, 0);
    const q = new Quaternion().setFromEuler(prevRotation).invert();
    const invertPrevRotation = new Euler().setFromQuaternion(q);

    // rotate back to original state and then apply new rotation
    anno.position = anno.position?.applyEuler(invertPrevRotation).applyEuler(rotation);
    anno.normal = anno.normal?.applyEuler(invertPrevRotation).applyEuler(rotation);
    anno.cameraPosition = anno.cameraPosition?.applyEuler(invertPrevRotation).applyEuler(rotation);
    anno.cameraTarget = anno.cameraTarget?.applyEuler(invertPrevRotation).applyEuler(rotation);
    anno.rotation = rotation;

    return anno;
  }

  // orientation changed
  useEffect(() => {
    const orientationEuler = getEulerFromOrientation(orientation);
    setAnnotations(
      annotations.map((anno: Annotation) => updateAnnotationRotation(anno, orientationEuler))
    )
  }, [orientation]);

  function isFacingCamera(anno: Annotation): boolean {
    const cameraDirection: Vector3 = camera.position.clone().normalize().sub(anno.position!.clone().normalize());
    const dotProduct: number = cameraDirection.dot(anno.normal!);

    if (dotProduct < DOT_PRODUCT_THRESHOLD) {
      return false;
    }

    return true;
  }

  function updateAnnotationPosition(idx: number, x: number, y: number) {
    const annoEl: HTMLElement = document.getElementById(`point-${idx}`)!;

    if (annoEl) {
      annoEl.setAttribute('transform', `translate(${x}, ${y})`);
    } else {
      console.error('could not find annotation element');
    }
  }

  function updateAnnotationPositions() {
    annotations.forEach((anno: Annotation, idx: number) => {
      // if not dragging the annotation, update its position
      if (dragRef.current !== idx) {
        const [x, y] = calculatePosition(anno);
        updateAnnotationPosition(idx, x, y);
      }
    });
  }

  function checkAnnotationsFacingCamera() {
    // loop through all annotations and check if their normals
    // are facing towards or away from the camera

    annotations.forEach((anno: Annotation, idx: number) => {
      const annoEl: HTMLElement = document.getElementById(`point-${idx}`)!;

      if (annoEl) {
        if (isFacingCamera(anno)) {
          annoEl.classList.remove('facing-away');
        } else {
          annoEl.classList.add('facing-away');
        }
      }
    });
  }

  useFrame(() => {
    updateAnnotationPositions();
    checkAnnotationsFacingCamera();
  });

  const triggerCameraControlsEnabledEvent = useEventTrigger(CAMERA_CONTROLS_ENABLED);

  const bind = useDrag((state) => {
    const el = state.currentTarget as HTMLDivElement;

    // get the element's index from the data-index attribute
    const idx = parseInt(el.getAttribute('data-idx')!);

    if (!isFacingCamera(annotations[idx])) {
      return;
    }

    let x;
    let y;

    if (!state.memo) {
      // just started dragging. use the initial position
      const transformValue = el.getAttribute('transform');
      let translateValues: string[] | null = null;
      if (transformValue) {
        const match = transformValue.match(/translate\(([^)]+)\)/);
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

      // if the annotation has moved, set the dragRef to the index
      if (x !== state.memo[0] || y !== state.memo[1]) {
        dragRef.current = idx;
      }
    }

    // set element position without updating state (that happens on MouseUp event)
    updateAnnotationPosition(idx, x, y);

    // memo the initial position
    if (!state.memo) {
      return [x, y];
    } else {
      return state.memo;
    }
  });

  // https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx#L25
  function calculatePosition(anno: Annotation) {
    const objectPos = v1.copy(anno.position!);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
  }

  function getIntersects(): Intersection<Object3D<Object3DEventMap>>[] {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(scene.children, true);
  }

  function drawAnnotations() {
    let primaryAnnotation: Annotation | null = null;
    let primaryIndex: number | null = null; 
    const fragments = [];

    annotations.map((anno: Annotation, index: number) => {
      if (selectedAnnotation == index) {
        primaryAnnotation = anno;
        primaryIndex = index;
      } else {
        fragments.push(drawAnnotation(anno, index));
      }
    });

    // Draw selected Annotation last so it overlaps others
    if (primaryAnnotation && primaryIndex != null) {
      fragments.push(drawAnnotation(primaryAnnotation, primaryIndex));
    }

    return fragments;
  }

  function drawAnnotation(anno: Annotation, index: number) {
    return (
      <React.Fragment key={index}>
        <g
          {...bind()}
          id={`point-${index}`}
          data-idx={index}
          className={cn('point', {
            selected: selectedAnnotation === index,
          })}
          onMouseDown={(_e: React.MouseEvent<SVGElement>) => {
            if (isFacingCamera(anno)) {
              triggerCameraControlsEnabledEvent(false);
            }
          }}
          onMouseUp={(_e: React.MouseEvent<SVGElement>) => {
            if (isFacingCamera(anno)) {
              // if was dragging this annotation
              if (dragRef.current === index) {
                const intersects: Intersection<Object3D>[] = getIntersects();

                if (intersects.length > 0) {
                  // update annotation position
                  setAnnotations(
                    annotations.map((anno: Annotation, idx: number) => {
                      if (idx === index) {
                        return {
                          ...anno,
                          position: intersects[0].point,
                          normal: intersects[0].face?.normal!,
                          cameraPosition: cameraRefs.position.current!,
                          cameraTarget: cameraRefs.target.current!,
                        };
                      }
                      return anno;
                    })
                  );
                }

                dragRef.current = null;
              } else {
                setSelectedAnnotation(index);
                triggerAnnoClick(anno);
              }

              triggerCameraControlsEnabledEvent(true);
            }
          }}>
          <circle r="11" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="black">
            {index + 1}
          </text>
          {selectedAnnotation === index && anno && anno.label && (
            <foreignObject width="200" height={anno.description ? 80 : 38} x="18">
              <div className="text">
                <div className="label">{anno.label}</div>
                {anno.description && <div className="description">{anno.description}</div>}
              </div>
            </foreignObject>
          )}
        </g>
      </React.Fragment>
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
            setAnnotations([
              ...annotations,
              {
                position: intersects[0].point,
                normal: intersects[0].face?.normal!,
                cameraPosition: cameraRefs.position.current!,
                cameraTarget: cameraRefs.target.current!,
                rotation: getEulerFromOrientation(orientation)
              },
            ]);

            setSelectedAnnotation(annotations.length);
          }
        }}>
        { drawAnnotations() }
      </svg>
    </Html>
  );
}
