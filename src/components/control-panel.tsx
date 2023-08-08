import React from 'react';
import { Annotation } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Settings } from 'lucide-react';
import { AmbientLightSelector } from './ambient-light-selector';
import useStore from '@/Store';
import { BoundsSelector } from './bounds-selector';

export function ControlPanel() {
  const { setAnnotateOnDoubleClickEnabled } = useStore();

  return (
    <div className="p-4">
      <Tabs
        defaultValue="scene"
        onValueChange={(tab: string) => {
          switch (tab) {
            case 'scene':
              setAnnotateOnDoubleClickEnabled(false);
              break;
            case 'annotations':
              setAnnotateOnDoubleClickEnabled(true);
              break;
          }
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

function SceneTab() {
  return (
    <div>
      <div>
        {/* <button className="text-white bg-blue-500 px-2 py-1" onClick={onHome}>
          Home
        </button> */}
        <BoundsSelector />
        <AmbientLightSelector />
      </div>
    </div>
  );
}

function AnnotationsTab() {
  const { annotations } = useStore();

  return (
    <div>
      {annotations.map((annotation: Annotation, index) => {
        return <div key={index}>{annotation.label}</div>;
      })}
    </div>
  );
}
