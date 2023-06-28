import { Euler, Vector3 } from '@react-three/fiber';

export type ModelSrc = {
  url: string;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
};
