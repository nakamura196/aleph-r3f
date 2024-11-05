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

  function Tab({ title, icon, value }: { title: string; icon: React.ReactNode; value: string }) {
    return (
      <TabsTrigger value={value} title={title} className="h-10">
        <span className="sr-only">{title}</span>
        {icon}
      </TabsTrigger>
    );
  }

  return (
    <Tabs
      value={mode}
      onValueChange={(value: string) => {
        setMode(value as Mode);
      }}
      className="h-full"
    >
      <TabsList className="grid w-full grid-cols-3 p-0">
        <Tab value="scene" title="Scene" icon={<Settings />} />
        <Tab value="annotation" title="Annotation" icon={<MapPin />} />
        <Tab value="measurement" title="Measurement" icon={<Ruler />} />
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
  );
}
