import '../style.css';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTF } from './GLTF';
import { ModelSrc } from 'src/types/ModelSrc';
import { CameraControls, useHelper } from '@react-three/drei';
import { BoxHelper, Group, Object3D } from 'three';
import useStore from '../Store';

interface AlephProps {
  ambientLightIntensity?: number;
  src: string | ModelSrc | ModelSrc[];
  onLoad?: (resource: any) => void;
  minDistance?: number;
  grid?: boolean;
  axes?: boolean;
  boundingBox?: boolean;
}

function Scene({ ambientLightIntensity = 1, src, minDistance = 0, grid, axes, boundingBox }: AlephProps) {
  const boundsRef = useRef<Group | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const { setAllModelsLoaded } = useStore();

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

  // function SceneNavigator() {
  //   useEffect(() => {
  //     console.log('SceneNavigator useEffect');
  //     const handleObjectLoaded = (e: CustomEvent) => {
  //       e.stopImmediatePropagation();
  //       zoomToObject(boundsRef.current!);
  //     };

  //     // @ts-ignore
  //     window.addEventListener('modelLoaded', handleObjectLoaded);

  //     return () => {
  //       // @ts-ignore
  //       window.removeEventListener('modelLoaded', handleObjectLoaded);
  //     };
  //   }, []);

  //   return <></>;
  // }

  function Bounds({ lineVisible, children }: { lineVisible?: boolean; children: React.ReactNode }) {
    const boundsLineRef = useRef<Group | null>(null);

    // @ts-ignore
    useHelper(boundsLineRef, BoxHelper, 'white');

    const handleOnClick = (e: any) => {
      e.stopPropagation();
      if (e.delta <= 2) {
        zoomToObject(e.object);
      }
    };

    const handleOnPointerMissed = (_e: any) => {
      zoomToObject(boundsRef.current!);
    };

    return (
      <group ref={boundsRef} onClick={handleOnClick} onPointerMissed={handleOnPointerMissed}>
        {lineVisible ? <group ref={boundsLineRef}>{children}</group> : children}
      </group>
    );
  }

  return (
    <>
      {/* <SceneNavigator /> */}
      <CameraControls
        ref={cameraControlsRef}
        minDistance={minDistance}
        // enabled={enabled}
        // verticalDragToForward={verticalDragToForward}
        // dollyToCursor={dollyToCursor}
        // infinityDolly={infinityDolly}
      />
      {grid && <gridHelper args={[100, 100]} />}
      {axes && <axesHelper args={[5]} />}
      <ambientLight intensity={ambientLightIntensity} />
      <Bounds lineVisible={boundingBox}>
        {modelSrcs.map((modelSrc, index) => {
          return (
            <GLTF
              key={index}
              {...modelSrc}
              onLoad={() => {
                // setTimeout(() => {
                console.log('model onLoad', modelSrc.url);
                setAllModelsLoaded(true);
                zoomToObject(boundsRef.current!);
                // }, 10);
                // zoomToObject(boundsRef.current!);
              }}
            />
          );
        })}
      </Bounds>
    </>
  );
}

export const Aleph: React.FC<AlephProps> = (props) => {
  const { setSceneCreated } = useStore();

  return (
    <Canvas
      onCreated={() => {
        // state update forces scene refs to be available
        setSceneCreated(true);
      }}>
      <Scene {...props} />
    </Canvas>
  );
};
