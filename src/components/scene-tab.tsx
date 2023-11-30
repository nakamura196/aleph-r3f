import React from 'react';
import { AmbientLightSelector } from './ambient-light-selector';
import { AxesSelector } from './axes-selector';
import { BoundsSelector } from './bounds-selector';
import { GridSelector } from './grid-selector';
import { OrthographicSelector } from './orthographic-selector';

function SceneTab() {
  return (
    <div>
      <BoundsSelector />
      <AmbientLightSelector />
      <OrthographicSelector />
      <GridSelector />
      <AxesSelector />
      {/* <ArrowHelpersSelector /> */}
    </div>
  );
}

export default SceneTab;
