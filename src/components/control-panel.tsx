import React, { useState } from 'react';
import Tabs, { Tab } from './tabs';
import { Switch } from '@/components/ui/switch';
import { Annotation } from '@/types';

export type TabName = 'Scene' | 'Annotations';

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

type SceneTabProps = {
  boundsEnabled: boolean;
  onBoundsEnabledChange: (enabled: boolean) => void;
  // onHome: () => void;
};

type AnnotationTabProps = {
  annotations: Annotation[];
};

type ControlPanelProps = SceneTabProps &
  AnnotationTabProps & {
    onTabChange: (tab: TabName) => void;
  };

export function ControlPanel({ annotations, boundsEnabled, onBoundsEnabledChange, onTabChange }: ControlPanelProps) {
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
            onTabChange(name);
          }}
        />
      </div>
      <>
        {currentTab === 'Scene' && (
          <SceneTab boundsEnabled={boundsEnabled} onBoundsEnabledChange={onBoundsEnabledChange} />
        )}
        {currentTab === 'Annotations' && <AnnotationsTab annotations={annotations} />}
      </>
    </>
  );
}

function SceneTab({ boundsEnabled, onBoundsEnabledChange }: SceneTabProps) {
  return (
    <div>
      <div>
        {/* <button className="text-white bg-blue-500 px-2 py-1" onClick={onHome}>
          Home
        </button> */}

        <Switch
          checked={boundsEnabled}
          onCheckedChange={(val) => {
            onBoundsEnabledChange(!boundsEnabled);
          }}
        />
      </div>
    </div>
  );
}

function AnnotationsTab({ annotations }: AnnotationTabProps) {
  return (
    <div>
      {annotations.map((annotation, index) => {
        return <div key={index}>{annotation.label}</div>;
      })}
    </div>
  );
}
