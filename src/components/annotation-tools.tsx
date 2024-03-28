import { useRef } from 'react';
import useInterval from '@/lib/hooks/use-interval';
import { useThree } from '@react-three/fiber';
import useStore from '@/Store';
import { Intersection, Object3D, Object3DEventMap, Vector3 } from 'three';
import { useEventListener, useEventTrigger } from '@/lib/hooks/use-event';
import { ANNO_CLICK, Annotation, CameraRefs, DBL_CLICK } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { cn } from '@/lib/utils';

export function AnnotationTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { annotations, setAnnotations, selectedAnnotation, setSelectedAnnotation } = useStore();
  const { scene, camera, pointer, raycaster } = useThree();

  // if a dot product is less than this, then the normal is facing away from the camera
  const DOT_PRODUCT_THRESHOLD = Math.PI * -0.1;

  const lastAnnoLength = useRef<number>(0);

  let annotationsFacingCameraCheckMS: number = 100;

  // create annotation on double click
  const handleDoubleClickEvent = () => {
    raycaster.setFromCamera(pointer, camera);

    const intersects: Intersection<Object3D<Object3DEventMap>>[] = raycaster.intersectObjects(scene.children, true);

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
  };

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

  useEventListener(DBL_CLICK, handleDoubleClickEvent);
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

  function checkAnnotationsFacingCamera() {
    // loop through all annotations and check if their normals
    // are facing towards or away from the camera

    const annosChanged = lastAnnoLength.current !== annotations.length;

    // if the number of annotations has changed, then we need to
    // check the normals immediately
    if (annosChanged) {
      annotationsFacingCameraCheckMS = 1;
    } else {
      annotationsFacingCameraCheckMS = 10;
    }

    annotations.forEach((anno: Annotation, idx: number) => {
      const annoEl: HTMLElement = document.getElementById(`anno-${idx}`)!;

      if (annosChanged) {
        annoEl.classList.add('no-fade');
      } else {
        annoEl.classList.remove('no-fade');
      }

      if (isFacingCamera(anno.position, anno.normal)) {
        annoEl.classList.remove('facing-away');
      } else {
        annoEl.classList.add('facing-away');
      }
    });

    lastAnnoLength.current = annotations.length;
  }

  useInterval(() => {
    checkAnnotationsFacingCamera();
  }, annotationsFacingCameraCheckMS);

  return (
    <>
      {annotations.map((anno: Annotation, idx: number) => {
        return (
          <React.Fragment key={idx}>
            {/* {arrowHelpersEnabled && <arrowHelper args={[anno.normal, anno.position, 0.05, 0xffffff]} />} */}
            <Html zIndexRange={[50, 0]} position={anno.position}>
              <div id={`anno-${idx}`} className="annotation">
                <div
                  className={cn('circle', { selected: selectedAnnotation === idx })}
                  onClick={(_e) => {
                    if (isFacingCamera(anno.position, anno.normal)) {
                      setSelectedAnnotation(idx);
                      triggerAnnoClick(anno);
                    }
                  }}>
                  <span className="label">{idx + 1}</span>
                </div>
              </div>
              {selectedAnnotation === idx && anno.label && (
                <div className="bg-black/75 text-white text-sm ml-5 px-3 py-2 min-w-40 -mt-1">
                  <div className="font-medium">{anno.label}</div>
                  {anno.description && <div className="text-xs mt-1 text-gray-300">{anno.description}</div>}
                </div>
              )}
            </Html>
          </React.Fragment>
        );
      })}
    </>
  );
}
