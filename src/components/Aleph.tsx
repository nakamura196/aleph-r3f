import '../style.css';
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTF } from './GLTF';
import { ModelSrc } from 'src/types/ModelSrc';
import { CameraControls, Environment, Html, useHelper, useProgress } from '@react-three/drei';
import { BoxHelper, Group, Object3D } from 'three';
import useStore from '../Store';
import { Environment as EnvironmentName } from '../types/Environment';

interface AlephProps {
  ambientLightIntensity?: number;
  src: string | ModelSrc | ModelSrc[];
  onLoad?: () => void;
  minDistance?: number;
  grid?: boolean;
  axes?: boolean;
  boundingBox?: boolean;
  environment: EnvironmentName;
}

function Scene({
  ambientLightIntensity = 0,
  axes,
  boundingBox,
  grid,
  minDistance = 0,
  onLoad,
  src,
  environment,
}: AlephProps) {
  const boundsRef = useRef<Group | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const { setModelSrcs, modelSrcs } = useStore();

  useEffect(() => {
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

    setModelSrcs(modelSrcs);
  }, [src]);

  function zoomToObject(object: Object3D, instant?: boolean, padding: number = 0.1) {
    cameraControlsRef.current!.fitToBox(object, !instant, {
      cover: false,
      paddingLeft: padding,
      paddingRight: padding,
      paddingBottom: padding,
      paddingTop: padding,
    });
  }

  // function LoadingCube({ position = [0, 0, 0], color = '#8A8A8A' }: { position?: Vector3; color?: string }) {
  //   const boundsRef = useRef<any>(null);
  //   const cubeRef = useRef<any>(null);
  //   useFrame(() => (cubeRef.current!.rotation.y = cubeRef.current!.rotation.y += 0.05));

  //   useEffect(() => {
  //     home(true, 5);
  //   }, []);

  //   return (
  //     <group scale={[1, 1, 1]} position={position} ref={boundsRef}>
  //       <pointLight position={[-1, 0, 0]} intensity={1} />
  //       <mesh ref={cubeRef}>
  //         <boxGeometry args={[0.5, 0.5, 0.5]} attach="geometry" />
  //         <meshPhongMaterial color={color} attach="material" />
  //       </mesh>
  //     </group>
  //   );
  // }

  function home(instant?: boolean, padding?: number) {
    if (boundsRef.current) {
      zoomToObject(boundsRef.current, instant, padding);
    }
  }

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
      home();
    };

    return (
      <group ref={boundsRef} onClick={handleOnClick} onPointerMissed={handleOnPointerMissed}>
        {lineVisible ? <group ref={boundsLineRef}>{children}</group> : children}
      </group>
    );
  }

  function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    if (progress === 100) {
      setTimeout(() => {
        home(true);
        if (onLoad) {
          onLoad();
        }
      }, 1);
    }

    return <Html wrapperClass="loading">{Math.ceil(progress)} %</Html>;
  }

  return (
    <>
      <CameraControls ref={cameraControlsRef} minDistance={minDistance} fov="45" />
      <ambientLight intensity={ambientLightIntensity} />
      <Bounds lineVisible={boundingBox}>
        <Suspense fallback={<Loader />}>
          {modelSrcs.map((modelSrc, index) => {
            return <GLTF key={index} {...modelSrc} />;
          })}
        </Suspense>
      </Bounds>
      <Environment preset={environment} />
      {grid && <gridHelper args={[100, 100]} />}
      {axes && <axesHelper args={[5]} />}
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
