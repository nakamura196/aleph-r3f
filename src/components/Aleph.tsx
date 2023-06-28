import '../style.css';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTF } from './GLTF';
import { ModelSrc } from 'src/types/ModelSrc';
import { SceneNavigator } from './SceneNavigator';

interface AlephProps {
  ambientLightIntensity?: number;
  src: string | ModelSrc | ModelSrc[];
  onLoad?: (resource: any) => void;
}

function Scene({ ambientLightIntensity = 1.5, src }: AlephProps) {
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

  return (
    <>
      <SceneNavigator />
      <ambientLight intensity={ambientLightIntensity} />
      {modelSrcs.map((modelSrc, index) => {
        return <GLTF key={index} {...modelSrc} />;
      })}
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
