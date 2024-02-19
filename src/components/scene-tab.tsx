import { AmbientLightSelector } from './ambient-light-selector';
import { AxesSelector } from './axes-selector';
import { BoundsSelector } from './bounds-selector';
import { GridSelector } from './grid-selector';
import { OrthographicSelector } from './orthographic-selector';
import { UpVectorSelector } from './upvector-selector';

function SceneTab() {
  return (
    <div>
      <AmbientLightSelector />
      <UpVectorSelector />
      <OrthographicSelector />
      <BoundsSelector />
      <GridSelector />
      <AxesSelector />
      {/* <ArrowHelpersSelector /> */}
    </div>
  );
}

export default SceneTab;
