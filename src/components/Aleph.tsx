import '../style.css';
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTF } from './GLTF';
import { ModelSrc } from 'src/types/ModelSrc';
import { CameraControls } from '@react-three/drei';
import { Group, Object3D } from 'three';
// import { SceneNavigator } from './SceneNavigator';

interface AlephProps {
  ambientLightIntensity?: number;
  src: string | ModelSrc | ModelSrc[];
  onLoad?: (resource: any) => void;
  minDistance?: number;
  grid?: boolean;
  axes?: boolean;
}

function Scene({ ambientLightIntensity = 1, src, minDistance = 0, grid, axes }: AlephProps) {
  const boundsRef = useRef<Group | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const modelSrcs: ModelSrc[] = [];

  // is the src a string or an array of ModelSrc objects?
  // if it's a string, create a ModelSrc object from it
  if (typeof src === 'string') {
    const modelSrc: ModelSrc = {
      url: src as string,
    };

    modelSrcs.push(modelSrc);
  } else if (Array.isArray(src)) {
    // if it's an array, then it's already a ModelSrc object
    modelSrcs.push(...(src as ModelSrc[]));
  } else {
    // if it's not a string or an array, then it's a single ModelSrc object
    modelSrcs.push(src as ModelSrc);
  }

  function zoomToObject(object: Object3D) {
    cameraControlsRef.current!.fitToBox(object, true);
  }

  function Bounds({ children }: { children: React.ReactNode }) {
    return (
      <group
        ref={boundsRef}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta <= 2) {
            zoomToObject(e.object);
          }
        }}
        onPointerMissed={(_e) => {
          zoomToObject(boundsRef.current!);
        }}>
        {children}
      </group>
    );
  }

  return (
    <>
      {/* <SceneNavigator /> */}
      {grid && <gridHelper args={[100, 100]} />}
      {axes && <axesHelper args={[5]} />}
      <ambientLight intensity={ambientLightIntensity} />
      <Bounds>
        {modelSrcs.map((modelSrc, index) => {
          return <GLTF key={index} {...modelSrc} />;
        })}
      </Bounds>
      <CameraControls
        ref={cameraControlsRef}
        minDistance={minDistance}
        // enabled={enabled}
        // verticalDragToForward={verticalDragToForward}
        // dollyToCursor={dollyToCursor}
        // infinityDolly={infinityDolly}
      />
    </>
  );
}

export const Aleph: React.FC<AlephProps> = (props) => {
  return (
    <Canvas>
      <Scene {...props} />
    </Canvas>
  );
};
