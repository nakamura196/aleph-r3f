import { create } from 'zustand';
import { Annotation, SrcObj } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  ambientLightIntensity: number;
  annotateOnDoubleClickEnabled: boolean;
  annotations: Annotation[];
  arrowHelpersEnabled: boolean;
  axesEnabled: boolean;
  boundsEnabled: boolean;
  gridEnabled: boolean;
  loading: boolean;
  orthographicEnabled: boolean;
  srcs: SrcObj[];
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
  setAnnotateOnDoubleClickEnabled: (annotateOnDoubleClickEnabled: boolean) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  setArrowHelpersEnabled: (arrowHelpers: boolean) => void;
  setAxesEnabled: (axesEnabled: boolean) => void;
  setBoundsEnabled: (boundsEnabled: boolean) => void;
  setGridEnabled: (gridEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOrthographicEnabled: (orthographicEnabled: boolean) => void;
  setSrcs: (srcs: SrcObj[]) => void;
};

const useStore = create<State>((set) => ({
  ambientLightIntensity: 0,
  annotateOnDoubleClickEnabled: false,
  annotations: [],
  arrowHelpersEnabled: false,
  axesEnabled: false,
  boundsEnabled: false,
  gridEnabled: false,
  loading: false,
  orthographicEnabled: false,
  srcs: [],

  setAmbientLightIntensity: (ambientLightIntensity: number) =>
    set({
      ambientLightIntensity,
    }),

  setAnnotateOnDoubleClickEnabled: (annotateOnDoubleClickEnabled: boolean) =>
    set({
      annotateOnDoubleClickEnabled,
    }),

  setAnnotations: (annotations: Annotation[]) =>
    set({
      annotations,
    }),

  setArrowHelpersEnabled: (arrowHelpersEnabled: boolean) =>
    set({
      arrowHelpersEnabled,
    }),

  setAxesEnabled: (axesEnabled: boolean) =>
    set({
      axesEnabled,
    }),

  setBoundsEnabled: (boundsEnabled: boolean) =>
    set({
      boundsEnabled,
    }),

  setGridEnabled: (gridEnabled: boolean) =>
    set({
      gridEnabled,
    }),

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setOrthographicEnabled: (orthographicEnabled: boolean) =>
    set({
      orthographicEnabled,
    }),

  setSrcs: (srcs: SrcObj[]) =>
    set({
      srcs,
      loading: true,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
