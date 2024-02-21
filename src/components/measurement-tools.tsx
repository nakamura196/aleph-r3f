import useStore from '@/Store';
import { CameraRefs, DBL_CLICK, Measurement } from '@/types';
import React from 'react';
import { CameraControls, Html } from '@react-three/drei';
import { useEventListener } from '@/lib/hooks/use-event';
import { useThree } from '@react-three/fiber';
import { Camera, Object3D, Vector3 } from 'three';
import { useDrag, Vector2 } from '@use-gesture/react';

export function MeasurementTools({ cameraRefs }: { cameraRefs: CameraRefs }) {
  const { measurements, setMeasurements, cameraControlsEnabled, setCameraControlsEnabled } = useStore();

  const { camera, pointer } = useThree();

  // create annotation on double click
  const handleDoubleClickEvent = () => {
    // const v = new Vector2();
    // v.set(pointer.x, pointer.y);

    setCameraControlsEnabled(false);

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

  // function Coords(el: Object3D, camera: Camera, size: { width: number; height: number }) {
  //   const v1 = new Vector3();
  //   const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  //   objectPos.project(camera);
  //   const widthHalf = size.width / 2;
  //   const heightHalf = size.height / 2;
  //   return [
  //     measurement.position[0] * widthHalf + widthHalf,
  //     -(measurement.position[1] * heightHalf) + heightHalf,
  //   ];
  // }

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
        calculatePosition={(el: Object3D, camera: Camera, size: { width: number; height: number }) => {
          const v1 = new Vector3();
          const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
          objectPos.project(camera);
          const widthHalf = size.width / 2;
          const heightHalf = size.height / 2;
          return [
            measurement.position[0] * widthHalf + widthHalf,
            -(measurement.position[1] * heightHalf) + heightHalf,
          ];
        }}
        style={{
          width: 0,
          height: 0,
        }}>
        <div
          {...bind()}
          id={`anno-${index}`}
          className="annotation"
          onMouseDown={handleMeasurementMouseDown}
          onMouseUp={handleMeasurementMouseUp}
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
            console.log('dragging', index, position);
            // const newMeasurements = [...measurements];
            // newMeasurements[index].position[0] = position[0];
            // newMeasurements[index].position[1] = position[1];
            // setMeasurements(newMeasurements);
          }}
        />
      ))}
    </>
  );
}

export default MeasurementTools;
