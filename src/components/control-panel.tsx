import '../index.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Settings } from 'lucide-react';
import useStore from '@/Store';
import AnnotationsTab from './annotations-tab';
import SceneTab from './scene-tab';
import { Mode } from '@/types';

export function ControlPanel() {
  const { mode, setMode } = useStore();

  return (
    <div className="p-4">
      <Tabs
        value={mode}
        onValueChange={(value: string) => {
          console.log('value', value);
          setMode(value as Mode);
        }}>
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="scene">
            <span className="sr-only">Scene</span>
            <Settings />
          </TabsTrigger>
          <TabsTrigger value="annotation">
            <span className="sr-only">Annotations</span>
            <MapPin />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scene">
          <SceneTab />
        </TabsContent>
        <TabsContent value="annotation">
          <AnnotationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
