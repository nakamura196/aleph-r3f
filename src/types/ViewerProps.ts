import { SrcObj } from './index';

export type ViewerProps = {
  onLoad?: () => void;
  src: string | SrcObj | SrcObj[];
};

export type ViewerRef = {
  recenter: () => void;
};
