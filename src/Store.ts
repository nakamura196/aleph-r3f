import { create } from 'zustand';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useStore = create<State>((set) => ({
  loading: false,

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
