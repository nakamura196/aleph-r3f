import { CameraControls } from '@react-three/drei';
import { Vector3 } from 'three';

export type CameraRefs = {
  controls: React.MutableRefObject<CameraControls | null>;
  defaults: CameraDefaults;
  position: React.MutableRefObject<Vector3 | null>;
  target: React.MutableRefObject<Vector3 | null>;
};

export type CameraDefaults = {
  perspective: CameraDefaultRefs;
  orthographic: CameraDefaultRefs
};

export type CameraDefaultRefs = {
  position: React.MutableRefObject<Vector3 | null>;
  target: React.MutableRefObject<Vector3 | null>;
  zoom: React.MutableRefObject<number | null>;
};