import { create } from 'zustand';
import { Annotation, SrcObj, Mode, Measurement } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  ambientLightIntensity: number;
  // annotateOnDoubleClickEnabled: boolean;
  annotations: Annotation[];
  // arrowHelpersEnabled: boolean;
  axesEnabled: boolean;
  boundsEnabled: boolean;
  gridEnabled: boolean;
  loading: boolean;
  measurements: Measurement[];
  mode: Mode;
  orthographicEnabled: boolean;
  srcs: SrcObj[];
  upVector: [number, number, number];
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  // setArrowHelpersEnabled: (arrowHelpers: boolean) => void;
  setAxesEnabled: (axesEnabled: boolean) => void;
  setBoundsEnabled: (boundsEnabled: boolean) => void;
  setGridEnabled: (gridEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMeasurements: (measurements: Measurement[]) => void;
  setMode: (mode: Mode) => void;
  setOrthographicEnabled: (orthographicEnabled: boolean) => void;
  setSrcs: (srcs: SrcObj[]) => void;
  setUpVector: (upVector: [number, number, number]) => void;
};

const useStore = create<State>((set) => ({
  ambientLightIntensity: 0,
  annotations: [],
  // arrowHelpersEnabled: false,
  axesEnabled: false,
  boundsEnabled: false,
  gridEnabled: false,
  loading: true,
  measurements: [],
  mode: 'scene',
  orthographicEnabled: false,
  srcs: [],
  upVector: [0, 1, 0],

  setAmbientLightIntensity: (ambientLightIntensity: number) =>
    set({
      ambientLightIntensity,
    }),

  setAnnotations: (annotations: Annotation[]) =>
    set({
      annotations,
    }),

  // setArrowHelpersEnabled: (arrowHelpersEnabled: boolean) =>
  //   set({
  //     arrowHelpersEnabled,
  //   }),

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

  setMeasurements: (measurements: Measurement[]) =>
    set({
      measurements,
    }),

  setMode: (mode: Mode) =>
    set({
      mode,
      orthographicEnabled: mode === 'measurement',
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

  setUpVector: (upVector: [number, number, number]) =>
    set({
      upVector,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
