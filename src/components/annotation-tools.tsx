import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useStore from '@/Store';
import { Intersection, Object3D, Object3DEventMap, Vector3 } from 'three';
import { useEventListener, useEventTrigger } from '@/lib/hooks/use-event';
import { ANNO_CLICK, Annotation, CAMERA_CONTROLS_ENABLED, CameraRefs } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { cn } from '@/lib/utils';
import { useDrag } from '@use-gesture/react';

export function AnnotationTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { annotations, setAnnotations, selectedAnnotation, setSelectedAnnotation } = useStore();
  const { scene, camera, pointer, raycaster, size } = useThree();

  // if a dot product is less than this, then the normal is facing away from the camera
  const DOT_PRODUCT_THRESHOLD = Math.PI * -0.1;

  const lastAnnoLength = useRef<number>(0);

  function zoomToAnnotation(annotation: Annotation) {
    cameraRefs.controls.current!.setPosition(
      annotation.cameraPosition.x,
      annotation.cameraPosition.y,
      annotation.cameraPosition.z,
      true
    );
    cameraRefs.controls.current!.setTarget(
      annotation.cameraTarget.x,
      annotation.cameraTarget.y,
      annotation.cameraTarget.z,
      true
    );
  }

  const handleAnnotationClick = (e: any) => {
    zoomToAnnotation(e.detail);
  };

  useEventListener(ANNO_CLICK, handleAnnotationClick);

  const triggerAnnoClick = useEventTrigger(ANNO_CLICK);

  function isFacingCamera(position: Vector3, normal: Vector3): boolean {
    const cameraDirection: Vector3 = camera.position.clone().normalize().sub(position.clone().normalize());
    const dotProduct: number = cameraDirection.dot(normal);

    if (dotProduct < DOT_PRODUCT_THRESHOLD) {
      return false;
    }

    return true;
  }

  function updateAnnotationPositions() {
    annotations.forEach((anno: Annotation, idx: number) => {
      const annoEl: HTMLElement = document.getElementById(`anno-${idx}`)!;

      if (annoEl) {
        const [x, y] = calculateAnnoPosition(anno);
        annoEl.setAttribute('transform', `translate(${x}, ${y})`);
      }
    });
  }

  function checkAnnotationsFacingCamera() {
    // loop through all annotations and check if their normals
    // are facing towards or away from the camera

    annotations.forEach((anno: Annotation, idx: number) => {
      const annoEl: HTMLElement = document.getElementById(`anno-${idx}`)!;

      if (annoEl) {
        if (isFacingCamera(anno.position, anno.normal)) {
          annoEl.classList.remove('facing-away');
        } else {
          annoEl.classList.add('facing-away');
        }
      }
    });

    lastAnnoLength.current = annotations.length;
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

    console.log('dragging', idx);
  });

  function getSVGMousePosition(e: React.MouseEvent<SVGElement>): [number, number] {
    const parentNode = e.currentTarget.parentNode as HTMLElement;

    // get parentNode offset
    const rect = parentNode.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return [x, y];
  }

  const v1 = new Vector3();

  // https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx#L25
  function calculateAnnoPosition(anno: Annotation) {
    const objectPos = v1.copy(anno.position);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
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
          raycaster.setFromCamera(pointer, camera);

          const intersects: Intersection<Object3D<Object3DEventMap>>[] = raycaster.intersectObjects(
            scene.children,
            true
          );

          if (intersects.length > 0) {
            setAnnotations([
              ...annotations,
              {
                position: intersects[0].point,
                normal: intersects[0].face?.normal!,
                cameraPosition: cameraRefs.position.current!,
                cameraTarget: cameraRefs.target.current!,
              },
            ]);

            setSelectedAnnotation(annotations.length);
          }
        }}>
        {/* draw points */}
        {annotations.map((anno: Annotation, index: number) => {
          return (
            <React.Fragment key={index}>
              <g
                {...bind()}
                id={`anno-${index}`}
                data-idx={index}
                className={cn('annotation', {
                  selected: selectedAnnotation === index,
                })}
                onClick={(_e: React.MouseEvent<SVGElement>) => {
                  if (isFacingCamera(anno.position, anno.normal)) {
                    setSelectedAnnotation(index);
                    triggerAnnoClick(anno);
                  }
                }}
                onMouseDown={(_e: React.MouseEvent<SVGElement>) => {
                  if (isFacingCamera(anno.position, anno.normal)) {
                    triggerCameraControlsEnabledEvent(false);
                  }
                }}
                onMouseUp={(e: React.MouseEvent<SVGElement>) => {
                  triggerCameraControlsEnabledEvent(true);

                  const mousePos: [number, number] = getSVGMousePosition(e);

                  console.log('mousePos', mousePos);
                }}>
                <circle r="11" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="black">
                  {index + 1}
                </text>
                {selectedAnnotation === index && anno.label && (
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
        })}
      </svg>
    </Html>
  );
}
