import React, { useState } from 'react';
import Tabs, { Tab } from './tabs';
import { Switch } from '@/components/ui/switch';

type ControlPanelProps = {
  onHome: () => void;
  annotationEnabled: boolean;
  onAnnotationsEnabledChange: (enabled: boolean) => void;
};

export function ControlPanel({ onHome, annotationEnabled, onAnnotationsEnabledChange }: ControlPanelProps) {
  type TabName = 'Scene' | 'Annotations';

  let tabs: Tab<TabName>[] = [
    {
      name: 'Scene',
      label: 'Scene',
    },
    {
      name: 'Annotations',
      label: 'Annotations',
    },
  ];

  const [currentTab, setCurrentTab] = useState<TabName>('Scene');

  return (
    <>
      <div className="mb-2 w-full">
        <Tabs
          tabs={tabs.map((tab, _index) => {
            return {
              name: tab.name,
              label: tab.label,
              current: tab.name === currentTab,
            };
          })}
          onChange={(current: number) => {
            const name: TabName = tabs[current].name;
            setCurrentTab(name);
          }}
        />
      </div>
      <div>
        <button className="text-white" onClick={onHome}>
          Home
        </button>
      </div>
      <>
        {currentTab === 'Scene' && <SceneTab />}
        {currentTab === 'Annotations' && (
          <AnnotationsTab
            annotationEnabled={annotationEnabled}
            onAnnotationsEnabledChange={onAnnotationsEnabledChange}
          />
        )}
      </>
    </>
  );
}

function SceneTab() {
  return <div>SceneTab</div>;
}

function AnnotationsTab({
  annotationEnabled,
  onAnnotationsEnabledChange,
}: {
  annotationEnabled: boolean;
  onAnnotationsEnabledChange: (enabled: boolean) => void;
}) {
  return (
    <div>
      <Switch
        checked={annotationEnabled}
        onCheckedChange={(val) => {
          console.log('annotations enabled changed', annotationEnabled);
          onAnnotationsEnabledChange(!annotationEnabled);
        }}
      />
    </div>
  );
}
