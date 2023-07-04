import { Environment as EnvironmentName, ModelSrc } from './index';

export type AlephProps = {
  ambientLightIntensity?: number;
  axes?: boolean;
  boundingBox?: boolean;
  environment: EnvironmentName;
  grid?: boolean;
  minDistance?: number;
  onLoad?: () => void;
  orthographic?: boolean;
  src: string | ModelSrc | ModelSrc[];
  upVector?: [number, number, number];
};
