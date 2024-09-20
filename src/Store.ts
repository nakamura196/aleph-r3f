import { create } from 'zustand';
import { Annotation, SrcObj, Mode, ObjectMeasurement, ScreenMeasurement, MeasurementMode } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  ambientLightIntensity: number;
  annotations: Annotation[];
  axesEnabled: boolean;
  boundsEnabled: boolean;
  gridEnabled: boolean;
  loading: boolean;
  measurementMode: MeasurementMode;
  measurementUnits: 'm' | 'mm';
  mode: Mode;
  objectMeasurements: ObjectMeasurement[];
  orthographicEnabled: boolean;
  screenMeasurements: ScreenMeasurement[];
  selectedAnnotation: number | null;
  srcs: SrcObj[];
  upVector: [number, number, number];
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  setAxesEnabled: (axesEnabled: boolean) => void;
  setBoundsEnabled: (boundsEnabled: boolean) => void;
  setGridEnabled: (gridEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMeasurementMode: (measurementMode: MeasurementMode) => void;
  setMeasurementUnits: (measurementUnits: 'm' | 'mm') => void;
  setMode: (mode: Mode) => void;
  setObjectMeasurements: (measurements: ObjectMeasurement[]) => void;
  setOrthographicEnabled: (orthographicEnabled: boolean) => void;
  setScreenMeasurements: (measurements: ScreenMeasurement[]) => void;
  setSelectedAnnotation: (selectedAnnotation: number | null) => void;
  setSrcs: (srcs: SrcObj[]) => void;
  setUpVector: (upVector: [number, number, number]) => void;
};

const useStore = create<State>((set) => ({
  ambientLightIntensity: 0,
  annotations: [],
  axesEnabled: false,
  boundsEnabled: false,
  gridEnabled: false,
  loading: true,
  measurementMode: 'object',
  measurementUnits: 'm',
  mode: 'scene',
  objectMeasurements: [],
  orthographicEnabled: false,
  screenMeasurements: [],
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

  setGridEnabled: (gridEnabled: boolean) =>
    set({
      gridEnabled,
    }),

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setMeasurementMode: (measurementMode: MeasurementMode) =>
    set({
      measurementMode,
    }),

  setMeasurementUnits: (measurementUnits: 'm' | 'mm') =>
    set({
      measurementUnits,
    }),

  setMode: (mode: Mode) =>
    set({
      mode,
      orthographicEnabled: mode === 'measurement', // enable orthographic camera for measurement mode only
    }),

  setObjectMeasurements: (measurements: ObjectMeasurement[]) =>
    set({
      objectMeasurements: measurements,
    }),

  setOrthographicEnabled: (orthographicEnabled: boolean) =>
    set({
      orthographicEnabled,
    }),

  setScreenMeasurements: (measurements: ScreenMeasurement[]) =>
    set({
      screenMeasurements: measurements,
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
