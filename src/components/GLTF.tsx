import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { a } from '@react-spring/three';
import { Group } from 'three';
import { ModelSrc } from 'src/types/ModelSrc';

export const GLTF = ({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: ModelSrc) => {
  const { scene } = useGLTF(url);
  const ref = useRef<Group | null>(null);
  const modelRef = useRef();

  useEffect(() => {
    const event = new CustomEvent('modelLoaded', { detail: url });
    window.dispatchEvent(event);
    console.log('model loaded', url);
  }, [url]);

  return (
    <a.group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive ref={modelRef} object={scene} scale={scale} />
    </a.group>
  );
};
