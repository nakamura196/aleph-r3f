import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Viewer, ControlPanel } from './components';
import { useControls } from 'leva';
import { SrcObj } from './types/Src';
import { ViewerRef } from './types';

function App() {
  const viewerRef = useRef<ViewerRef>(null);

  // https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Models-showcase.md
  const [{ src }, _setLevaControls] = useControls(() => ({
    src: {
      options: {
        // 'Measurement Cube': {
        //   url: 'https://cdn.glitch.global/afd88411-0206-477e-b65f-3d1f201de994/measurement_cube.glb?v=1710500461208',
        //   label: 'Measurement Cube',
        // },
        'Flight Helmet':
          'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF/FlightHelmet.gltf',
        Shoe: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
        Mosquito:
          'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb',
        Thor: {
          url: 'https://modelviewer.dev/assets/SketchfabModels/ThorAndTheMidgardSerpent.glb',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        } as SrcObj,
        'Multiple Objects': [
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/Mixer.glb',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/GeoPlanter.glb',
            position: [0.5, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb',
            position: [1, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          {
            url: 'https://modelviewer.dev/assets/ShopifyModels/Chair.glb',
            position: [1.5, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        ] as SrcObj[],
        // 'Frog (Draco) URL': 'https://aleph-gltf-models.netlify.app/Frog.glb',
      },
    },
    // Recenter: button((_get) => {
    //   viewerRef.current?.recenter();
    // }),
  }));

  return (
    <div id="container">
      <div id="control-panel">
        <ControlPanel></ControlPanel>
      </div>
      <div id="viewer">
        <Viewer
          ref={viewerRef}
          src={src}
          onLoad={() => {
            // console.log('model(s) loaded');
          }}
        />
      </div>
    </div>
  );
}

export default App;
