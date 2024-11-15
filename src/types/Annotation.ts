import { Vector3 } from 'three';
import { Point } from './Point';

export type Annotation = Point & {
  cameraPosition?: Vector3;
  cameraTarget?: Vector3;
  description?: string;
  label?: string;
};
