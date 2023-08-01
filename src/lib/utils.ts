import { Vector3 as R3FVector3 } from '@react-three/fiber';
import { Vector3 } from 'three';
import { ModelSrc } from '../types/ModelSrc';

export function getCenterPosition(objects: ModelSrc[]) {
  // Initialize center position to [0, 0, 0]
  let centerPosition: number[] = [0, 0, 0];

  // Calculate the sum of positions
  for (const object of objects) {
    const position: number[] = (object.position as number[]) || [0, 0, 0];
    centerPosition[0] += position[0];
    centerPosition[1] += position[1];
    centerPosition[2] += position[2];
  }

  // Divide the sum by the number of objects to get the average
  const numObjects = objects.length;
  centerPosition[0] /= numObjects;
  centerPosition[1] /= numObjects;
  centerPosition[2] /= numObjects;

  return centerPosition as R3FVector3;
}

export function formatVector3AsString(vector: Vector3) {
  return `x: ${vector.x}, y: ${vector.y}, z: ${vector.z}`;
}
