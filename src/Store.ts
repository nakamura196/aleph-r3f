import { create } from 'zustand';
import { Annotation, SrcObj } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  ambientLightIntensity: number;
  annotateOnDoubleClickEnabled: boolean;
  annotations: Annotation[];
  boundsEnabled: boolean;
  loading: boolean;
  srcs: SrcObj[];
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
  setAnnotateOnDoubleClickEnabled: (annotateOnDoubleClickEnabled: boolean) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  setBoundsEnabled: (boundsEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSrcs: (srcs: SrcObj[]) => void;
};

const useStore = create<State>((set) => ({
  ambientLightIntensity: 0,
  annotateOnDoubleClickEnabled: false,
  annotations: [],
  boundsEnabled: false,
  loading: false,
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

  setBoundsEnabled: (boundsEnabled: boolean) =>
    set({
      boundsEnabled,
    }),

  setLoading: (loading: boolean) =>
    set({
      loading,
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
