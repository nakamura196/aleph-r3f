import { CameraControls } from '@react-three/drei';
import { Vector3 } from 'three';

export type CameraRefs = {
  cameraControls: React.MutableRefObject<CameraControls | null>;
  cameraPosition: React.MutableRefObject<Vector3 | null>;
  cameraTarget: React.MutableRefObject<Vector3 | null>;
};
