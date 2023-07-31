import { create } from 'zustand';
import { Annotation, ModelSrc } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  modelSrcs: ModelSrc[];
  setModelSrcs: (modelSrcs: ModelSrc[]) => void;
  annotations: Annotation[];
  setAnnotations: (annotations: Annotation[]) => void;
};

const useStore = create<State>((set) => ({
  loading: false,
  modelSrcs: [],
  annotations: [],

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setModelSrcs: (modelSrcs: ModelSrc[]) =>
    set({
      modelSrcs,
      loading: true,
    }),

  setAnnotations: (annotations: Annotation[]) =>
    set({
      annotations,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
