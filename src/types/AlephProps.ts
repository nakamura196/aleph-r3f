import { Environment as EnvironmentName, ModelSrc } from './index';

export type AlephProps = {
  annotation?: boolean;
  ambientLightIntensity?: number;
  arrowHelpers?: boolean;
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
