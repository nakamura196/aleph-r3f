import '../index.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Settings, Ruler } from 'lucide-react';
import useStore from '@/Store';
import AnnotationTab from './annotation-tab';
import SceneTab from './scene-tab';
import { Mode } from '@/types';
import MeasurementTab from './measurement-tab';

export function ControlPanel() {
  const { mode, setMode } = useStore();

  return (
    <div>
      <Tabs
        value={mode}
        onValueChange={(value: string) => {
          setMode(value as Mode);
        }}>
        <TabsList className="grid w-full grid-cols-3 p-0">
          <TabsTrigger value="scene" title="Scene" className="h-10">
            <span className="sr-only">Scene</span>
            <Settings />
          </TabsTrigger>
          <TabsTrigger value="annotation" title="Annotation" className="h-10">
            <span className="sr-only">Annotation</span>
            <MapPin />
          </TabsTrigger>
          <TabsTrigger value="measurement" title="Measurement" className="h-10">
            <span className="sr-only">Measurement</span>
            <Ruler />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scene">
          <SceneTab />
        </TabsContent>
        <TabsContent value="annotation">
          <AnnotationTab />
        </TabsContent>
        <TabsContent value="measurement">
          <MeasurementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
