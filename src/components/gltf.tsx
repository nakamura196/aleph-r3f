import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
// import { a } from '@react-spring/three';
import { Euler, Group } from 'three';
import { UpVector } from '@/types';
import { SrcObj } from '@/types/Src';
import { getEulerAnglesFromOrientation } from '@/lib/utils';

type GLTFProps = SrcObj & {
  orientation?: UpVector;
  onLoad?: (url: string) => void;
};

export const GLTF = ({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], orientation, onLoad }: GLTFProps) => {
  const { scene } = useGLTF(url, true, true, (e) => {
    // @ts-ignore
    e.manager.onLoad = () => {
      if (onLoad) {
        onLoad(url);
      }
    };
  });
  const ref = useRef<Group | null>(null);
  const modelRef = useRef();

  const outerRotation = new Euler().fromArray(getEulerAnglesFromOrientation(orientation || 'y-positive'));
  
  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <group ref={ref} position={position} rotation={outerRotation} scale={scale}>
        <primitive ref={modelRef} object={scene} rotation={rotation} scale={scale} />
      </group>
    </>
  );
};
