import { create } from 'zustand';
import { Annotation, SrcObj, Mode, Measurement } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  ambientLightIntensity: number;
  annotations: Annotation[];
  axesEnabled: boolean;
  boundsEnabled: boolean;
  cameraControlsEnabled: boolean;
  gridEnabled: boolean;
  loading: boolean;
  measurements: Measurement[];
  measurementUnits: 'm' | 'mm';
  mode: Mode;
  orthographicEnabled: boolean;
  selectedAnnotation: number | null;
  srcs: SrcObj[];
  upVector: [number, number, number];
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  setAxesEnabled: (axesEnabled: boolean) => void;
  setBoundsEnabled: (boundsEnabled: boolean) => void;
  setCameraControlsEnabled: (cameraControlsEnabled: boolean) => void;
  setGridEnabled: (gridEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMeasurements: (measurements: Measurement[]) => void;
  setMeasurementUnits: (measurementUnits: 'm' | 'mm') => void;
  setMode: (mode: Mode) => void;
  setOrthographicEnabled: (orthographicEnabled: boolean) => void;
  setSelectedAnnotation: (selectedAnnotation: number | null) => void;
  setSrcs: (srcs: SrcObj[]) => void;
  setUpVector: (upVector: [number, number, number]) => void;
};

const useStore = create<State>((set) => ({
  ambientLightIntensity: 0,
  annotations: [],
  axesEnabled: false,
  boundsEnabled: false,
  cameraControlsEnabled: true,
  gridEnabled: false,
  loading: true,
  measurements: [],
  measurementUnits: 'm',
  mode: 'scene',
  orthographicEnabled: false,
  selectedAnnotation: null,
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

  setAxesEnabled: (axesEnabled: boolean) =>
    set({
      axesEnabled,
    }),

  setBoundsEnabled: (boundsEnabled: boolean) =>
    set({
      boundsEnabled,
    }),

  setCameraControlsEnabled: (cameraControlsEnabled: boolean) =>
    set({
      cameraControlsEnabled,
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

  setMeasurementUnits: (measurementUnits: 'm' | 'mm') =>
    set({
      measurementUnits,
    }),

  setMode: (mode: Mode) =>
    set({
      mode,
      cameraControlsEnabled: true, // default to cameraControlsEnabled for all modes
      orthographicEnabled: mode === 'measurement', // enable orthographic camera for measurement mode only
    }),

  setOrthographicEnabled: (orthographicEnabled: boolean) =>
    set({
      orthographicEnabled,
    }),

  setSelectedAnnotation: (selectedAnnotation: number | null) =>
    set({
      selectedAnnotation,
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
