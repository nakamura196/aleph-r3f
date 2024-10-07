import { CameraModeSelector } from './camera-mode-selector';
import { RecenterButton } from './recenter-button';
import { TabSection } from "./tab-section";
import { UpVectorSelector } from './upvector-selector';

export function CameraPanel() {
  return (
    <TabSection className="mt-4 pt-4">
      <UpVectorSelector />
      <CameraModeSelector />
      <RecenterButton />
    </TabSection>
  );
}