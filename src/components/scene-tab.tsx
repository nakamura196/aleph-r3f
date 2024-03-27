import { AmbientLightSelector } from './ambient-light-selector';
import { AxesSelector } from './axes-selector';
import { BoundsSelector } from './bounds-selector';
import { GridSelector } from './grid-selector';
import { Tab } from './tab';
import { OrthographicSelector } from './orthographic-selector';
import { UpVectorSelector } from './upvector-selector';

function SceneTab() {
  return (
    <Tab>
      <AmbientLightSelector />
      <UpVectorSelector />
      <OrthographicSelector />
      <BoundsSelector />
      <GridSelector />
      <AxesSelector />
      {/* <ArrowHelpersSelector /> */}
    </Tab>
  );
}

export default SceneTab;
