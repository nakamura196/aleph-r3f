import { CameraPanel } from "./camera-panel";
import { TabSection } from "./tab-section";

export function Tab({ children }: { children: React.ReactNode }) {
  return (
    <div className="tab-scroll grid gap-y-4 text-sm p-4">
      <div className="flex flex-col justify-between">
        <TabSection>
          {children}
        </TabSection>
        <CameraPanel />
      </div>
    </div>
  );
}
