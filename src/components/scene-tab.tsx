import { useEventTrigger } from '@/lib/hooks/use-event';

import { AmbientLightSelector } from './ambient-light-selector';
import { AxesSelector } from './axes-selector';
import { BoundsSelector } from './bounds-selector';

import { CameraModeSelector } from './camera-mode-selector';
import { GridSelector } from './grid-selector';
import { Tab } from './tab';
import { Button } from './ui/button';
import { RECENTER } from '@/types';
import { UpVectorSelector } from './upvector-selector';

function SceneTab() {
  const triggerRecenterEvent = useEventTrigger(RECENTER);

  return (
    <Tab>
      <AmbientLightSelector />
      <UpVectorSelector />
      <CameraModeSelector />
      <BoundsSelector />
      <GridSelector />
      <AxesSelector />
      <Button
        className="text-white mt-6"
        onClick={() => {
          triggerRecenterEvent();
        }}>
        Recenter
      </Button>
    </Tab>
  );
}

export default SceneTab;
