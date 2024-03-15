import { Euler, Vector3 } from '@react-three/fiber';

export type Src = string | SrcObj | SrcObj[];

export type SrcObj = {
  label?: string;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
  rights?: string;
  requiredStatement?: string;
  url: string;
};
