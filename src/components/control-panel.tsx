import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Settings } from 'lucide-react';
import useStore from '@/Store';
import AnnotationsTab from './annotations-tab';
import SceneTab from './scene-tab';

export function ControlPanel() {
  const { setAnnotateOnDoubleClickEnabled } = useStore();

  type Tab = 'scene' | 'annotations';

  const [tab, setTab] = useState<Tab>('scene');

  // useKeyPress('s', () => {
  //   setTab('scene');
  // });

  // useKeyPress('a', () => {
  //   setTab('annotations');
  // });

  useEffect(() => {
    // set global state
    switch (tab) {
      case 'scene':
        setAnnotateOnDoubleClickEnabled(false);
        break;
      case 'annotations':
        setAnnotateOnDoubleClickEnabled(true);
        break;
    }
  }, [tab]);

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onValueChange={(value: string) => {
          setTab(value as Tab);
        }}>
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="scene">
            <span className="sr-only">Scene</span>
            <Settings />
          </TabsTrigger>
          <TabsTrigger value="annotations">
            <span className="sr-only">Annotations</span>
            <MapPin />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scene">
          <SceneTab />
        </TabsContent>
        <TabsContent value="annotations">
          <AnnotationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
