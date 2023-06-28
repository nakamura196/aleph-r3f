import { Vector3 } from '@react-three/fiber';
import { ModelSrc } from './types/ModelSrc';

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

  return centerPosition as Vector3;
}
