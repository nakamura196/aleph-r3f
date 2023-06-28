import { create } from 'zustand';
// import { mountStoreDevtool } from 'simple-zustand-devtools';

type State = {
  sceneCreated: boolean;
  allModelsLoaded: boolean;
  setSceneCreated: (created: boolean) => void;
  setAllModelsLoaded: (loaded: boolean) => void;
};

const useStore = create<State>((set) => ({
  sceneCreated: false,
  allModelsLoaded: false,

  setSceneCreated: (sceneCreated: boolean) =>
    set({
      sceneCreated,
    }),

  setAllModelsLoaded: (allModelsLoaded: boolean) =>
    set({
      allModelsLoaded,
    }),
}));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

export default useStore;
