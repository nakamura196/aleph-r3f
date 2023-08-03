import { create } from 'zustand';
import { Annotation, SrcObj } from './types/';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  modelSrcs: SrcObj[];
  setModelSrcs: (modelSrcs: SrcObj[]) => void;
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

  setModelSrcs: (modelSrcs: SrcObj[]) =>
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
