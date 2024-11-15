import { Euler, Vector3 } from "three";

export type Point = {
  normal?: Vector3;
  position?: Vector3;
  rotation?: Euler;
};