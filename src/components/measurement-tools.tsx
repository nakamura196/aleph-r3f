import useStore from '@/Store';
import { CameraRefs, DBL_CLICK, Measurement } from '@/types';
import React from 'react';
import { CameraControls, Html } from '@react-three/drei';
import { useEventListener } from '@/lib/hooks/use-event';
import { useThree } from '@react-three/fiber';
import { Camera, Matrix4, Object3D, Vector3 } from 'three';
import { useDrag, Vector2 } from '@use-gesture/react';

export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { measurements, setMeasurements, cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  const { camera, pointer, size, raycaster } = useThree();

  // create annotation on double click
  const handleDoubleClickEvent = () => {
    // const v = new Vector2();
    // v.set(pointer.x, pointer.y);

    setCameraControlsEnabled(false);

    console.log('double click', [pointer.x, pointer.y]);

    setMeasurements([
      ...measurements,
      {
        position: [pointer.x, pointer.y],
        // normal: intersects[0].face?.normal!,
        // cameraPosition: cameraRefs.position.current!,
        // cameraTarget: cameraRefs.target.current!,
      },
    ]);
  };

  useEventListener(DBL_CLICK, handleDoubleClickEvent);

  const handleMeasurementMouseDown = (_e: any) => {
    // console.log('mousedown', e);
    // setTimeout(() => {
    //   setCameraControlsEnabled(false);
    // }, 1);
  };

  const handleMeasurementMouseUp = (_e: any) => {
    // console.log('mouseup', e);
    // setTimeout(() => {
    //   setCameraControlsEnabled(true);
    // }, 1);
  };

  type MeasurementPointProps = {
    index: number;
    measurement: Measurement;
    onDrag: (index: number, position: Vector2) => void;
  };

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

  const MeasurementPoint: React.FC<MeasurementPointProps> = ({ index, measurement, onDrag }) => {
    const bind = useDrag((state) => {
      if (cameraControlsEnabled) {
        return;
      }

      const div: any = state.currentTarget;

      // set div position from offset
      div.style.left = `${state.offset[0]}px`;
      div.style.top = `${state.offset[1]}px`;

      onDrag(index, state.xy);
    });

    return (
      <Html
        calculatePosition={(el: Object3D) => {
          return sceneToScreenCoords(el, measurement.position);
        }}
        style={{
          width: 0,
          height: 0,
        }}>
        <div
          {...bind()}
          id={`anno-${index}`}
          className="annotation"
          onMouseDown={(event: React.MouseEvent) => {}}
          onMouseUp={(event: React.MouseEvent) => {
            const measurement = measurements[index];

            console.log('measurement position', measurement.position);

            // raycaster.setFromCamera(pointer, camera);

            // const intersects = raycaster.intersectObject(camera, false);

            // console.log('intersects', intersects);

            const upcoords = [pointer.x, pointer.y];

            console.log('upcoords', upcoords);

            // setMeasurements(
            //   measurements.map((measurement, idx) => {
            //     if (idx === index) {
            //       return {
            //         position: [pointer.x, pointer.y],
            //         // normal: intersects[0].face?.normal!,
            //         // cameraPosition: cameraRefs.position.current!,
            //         // cameraTarget: cameraRefs.target.current!,
            //       };
            //     } else {
            //       return measurement;
            //     }
            //   })
            // );

            // console.log('screenToSceneCoords', screenToSceneCoords([pointer.x, pointer.y]));

            // console.log('mouse', mouse);
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

  return (
    <>
      {measurements.map((measurement, idx) => (
        <MeasurementPoint
          key={idx}
          index={idx}
          measurement={measurement}
          onDrag={(index: number, position: Vector2) => {
            // const sceneCoords = screenToSceneCoords(position);
            // console.log('dragging', index, sceneCoords);
            // console.log('measurements', measurements);
            // const newMeasurements = [...measurements];
            // newMeasurements[index].position[0] = pointer.x;
            // newMeasurements[index].position[1] = pointer.y;
            // setMeasurements(newMeasurements);
          }}
        />
      ))}
    </>
  );
}

export default MeasurementTools;
