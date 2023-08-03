import { Annotation, Environment as EnvironmentName, SrcObj } from './index';

export type ViewerProps = {
  annotations?: Annotation[];
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  annotateOnDoubleClickEnabled?: boolean;
  ambientLightIntensity?: number;
  arrowHelpers?: boolean;
  axes?: boolean;
  boundingBoxEnabled?: boolean;
  environment?: EnvironmentName;
  grid?: boolean;
  minDistance?: number;
  onLoad?: () => void;
  orthographic?: boolean;
  src: string | SrcObj | SrcObj[];
  upVector?: [number, number, number];
};

export type ViewerRef = {
  home: () => void;
};
