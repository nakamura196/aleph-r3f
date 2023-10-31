import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Annotation } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Settings } from 'lucide-react';
import { AmbientLightSelector } from './ambient-light-selector';
import useStore from '@/Store';
import { BoundsSelector } from './bounds-selector';
import clsx from 'clsx';
import { OrthographicSelector } from './orthographic-selector';
import { GridSelector } from './grid-selector';
import { AxesSelector } from './axes-selector';
import { triggerEvent } from '@/lib/utils';
import { ANNO_CLICK } from '@/types/Events';
import { Button } from './ui/button';
import useKeyPress from '@/lib/hooks/use-key-press';

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

function SceneTab() {
  return (
    <div>
      <BoundsSelector />
      <AmbientLightSelector />
      <OrthographicSelector />
      <GridSelector />
      <AxesSelector />
      {/* <ArrowHelpersSelector /> */}
    </div>
  );
}

function AnnotationsTab() {
  type ErrorType = 'label';

  type Errors = {
    [key in ErrorType]?: boolean;
  };

  const { annotations, setAnnotations } = useStore();

  const [editIdx, setEditIdx] = React.useState<number | null>(null);
  const [label, setLabel] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const dragStart = (e: any) => {
    dragItem.current = parseInt(e.target.dataset.idx);
  };

  const dragEnter = (e: any) => {
    dragOverItem.current = parseInt(e.currentTarget.dataset.idx);
  };

  const drop = () => {
    const copyListItems = [...annotations];
    const dragItemContent = copyListItems[dragItem.current as number];
    copyListItems.splice(dragItem.current as number, 1);
    copyListItems.splice(dragOverItem.current as number, 0, dragItemContent);
    dragItem.current = null;
    setAnnotations(copyListItems);
  };

  // Form validation
  const [errors, setErrors] = useState<Errors>({});

  const handleValidation = () => {
    let tempErrors: Errors = {};
    let isValid = true;

    if (label!.length <= 0) {
      tempErrors['label'] = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValidForm = handleValidation();

    if (isValidForm) {
      const copyListItems = [...annotations];
      // const { label: oldLabel } = copyListItems[idx];
      const updatedItem = { ...copyListItems[editIdx as number], label, description };
      const updatedListItems = [
        ...copyListItems.slice(0, editIdx as number),
        updatedItem,
        ...copyListItems.slice((editIdx as number) + 1),
      ];
      setAnnotations(updatedListItems);
      setLabel('');
      setDescription('');
      setEditIdx(null);
    }
  };

  return (
    <div className="grid gap-y-2">
      {annotations.map((anno: Annotation, idx) => {
        return (
          <div
            key={idx}
            className="flex items-center justify-between shadow-sm cursor-move"
            draggable="true"
            onDragStart={(e) => dragStart(e)}
            onDragEnter={(e) => dragEnter(e)}
            onDragEnd={drop}
            data-idx={idx}>
            {editIdx === idx && (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col min-w-0">
                  <input
                    type="text"
                    placeholder="Label"
                    className="font-medium text-sm md:text-md truncate text-black"
                    defaultValue={anno.label}
                    required
                    maxLength={64}
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  />
                  <textarea
                    placeholder="Description"
                    className="text-xs text-zinc-500 dark:text-zinc-400 truncate text-black"
                    defaultValue={anno.description}
                    maxLength={256}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="default" type="submit">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </Button>
                </div>
              </form>
            )}
            {editIdx !== idx && (
              <>
                <div
                  className="max-w-full"
                  onClick={() => {
                    triggerEvent(ANNO_CLICK, anno);
                  }}>
                  <h3 className="text-white font-medium text-sm md:text-md truncate">{`${idx + 1}, ${
                    anno.label || 'no label'
                  }`}</h3>
                  <p className="text-white text-xs text-zinc-500 dark:text-zinc-400 truncate">{anno.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditIdx(idx);
                      setLabel(anno.label);
                      setDescription(anno.description);
                      triggerEvent(ANNO_CLICK, anno);
                    }}>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
                    </svg>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setAnnotations(annotations.filter((_, i) => i !== idx));
                    }}>
                    <svg
                      className=" h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
