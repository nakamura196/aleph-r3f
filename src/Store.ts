import { create } from 'zustand';
import { ModelSrc } from './types/ModelSrc';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  modelSrcs: ModelSrc[];
  setModelSrcs: (modelSrcs: ModelSrc[]) => void;
};

const useStore = create<State>((set) => ({
  loading: false,
  modelSrcs: [],

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setModelSrcs: (modelSrcs: ModelSrc[]) =>
    set({
      modelSrcs,
      loading: true,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
