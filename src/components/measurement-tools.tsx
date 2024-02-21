import useStore from '@/Store';
import { CameraRefs, DBL_CLICK, Measurement } from '@/types';
import React from 'react';
import { Html } from '@react-three/drei';
import { useEventListener } from '@/lib/hooks/use-event';
import { useThree } from '@react-three/fiber';
import { Camera, Intersection, Object3D, Object3DEventMap, Vector2, Vector3 } from 'three';

export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { measurements, setMeasurements } = useStore();

  const { scene, camera, pointer, raycaster } = useThree();

  // create annotation on double click
  const handleDoubleClickEvent = () => {
    raycaster.setFromCamera(pointer, camera);

    // const intersects: Intersection<Object3D<Object3DEventMap>>[] = raycaster.intersectObjects(scene.children, true);

    const v = new Vector2();
    v.set(pointer.x, pointer.y);

    //if (intersects.length > 0) {
    setMeasurements([
      ...measurements,
      {
        position: v,
        // normal: intersects[0].face?.normal!,
        // cameraPosition: cameraRefs.position.current!,
        // cameraTarget: cameraRefs.target.current!,
      },
    ]);
    //}
  };

  useEventListener(DBL_CLICK, handleDoubleClickEvent);

  return (
    <>
      {measurements.map((measurement: Measurement, idx: number) => {
        return (
          <React.Fragment key={idx}>
            {/* {arrowHelpersEnabled && <arrowHelper args={[anno.normal, anno.position, 0.05, 0xffffff]} />} */}
            <Html
              calculatePosition={(el: Object3D, camera: Camera, size: { width: number; height: number }) => {
                // console.log('el', el);
                const v1 = new Vector3();
                const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
                objectPos.project(camera);
                const widthHalf = size.width / 2;
                const heightHalf = size.height / 2;
                // return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
                return [
                  measurement.position.x * widthHalf + widthHalf,
                  -(measurement.position.y * heightHalf) + heightHalf,
                ];
              }}
              style={{
                width: 0,
                height: 0,
              }}>
              <div id={`anno-${idx}`} className="annotation">
                <div
                  className="circle"
                  onClick={(_e) => {
                    // triggerMeasurementClick(measurement);
                  }}>
                  <span className="label">{idx + 1}</span>
                </div>
              </div>
            </Html>
          </React.Fragment>
        );
      })}
    </>
  );
}

export default MeasurementTools;
