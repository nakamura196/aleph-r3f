import React from 'react';
import ReactDOM from 'react-dom/client';
import { Aleph } from './index';
import { useControls } from 'leva';
import { ModelSrc } from './types/ModelSrc';

const Wrapper = () => {
  const [{ src, ambientLightIntensity }, setLevaControls] = useControls(() => ({
    src: {
      options: {
        'Flight Helmet':
          'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/FlightHelmet/glTF/FlightHelmet.gltf',
        Thor: {
          url: 'https://modelviewer.dev/assets/SketchfabModels/ThorAndTheMidgardSerpent.glb',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        } as ModelSrc,
        'Multiple Objects': [
          // {
          //   url: 'https://modelviewer.dev/assets/ShopifyModels/Canoe.glb',
          //   position: [0, 0, 0],
          //   rotation: [0, 0, 0],
          //   scale: [1, 1, 1],
          // },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/Mixer.glb',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/GeoPlanter.glb',
            position: [2, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb',
            position: [4, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/Chair.glb',
            position: [6, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        ] as ModelSrc[],
        'Frog (Draco) URL': 'https://aleph-gltf-models.netlify.app/Frog.glb',
      },
    },
    ambientLightIntensity: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
  }));

  return (
    <Aleph
      src={src}
      ambientLightIntensity={ambientLightIntensity}
      onLoad={() => {
        console.log('loaded');
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Wrapper />);
