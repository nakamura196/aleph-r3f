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
import { ANNO_CLICK, CAMERA_UPDATE } from '@/types/Events';
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
  // type ErrorType = 'label';

  // type Errors = {
  //   [key in ErrorType]?: boolean;
  // };

  const { annotations, setAnnotations } = useStore();

  const [editIdx, setEditIdx] = React.useState<number | null>(null);
  const [label, setLabel] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const cameraPositionRef = useRef<THREE.Vector3>();
  const cameraTargetRef = useRef<THREE.Vector3>();

  useKeyPress('Escape', () => {
    setEditIdx(null);
  });

  // register/unregister event handlers
  useEffect(() => {
    window.addEventListener(CAMERA_UPDATE, handleCameraUpdateEvent);

    return () => {
      window.removeEventListener(CAMERA_UPDATE, handleCameraUpdateEvent);
    };
  }, []);

  const handleCameraUpdateEvent = (e: any) => {
    cameraPositionRef.current = e.detail.cameraPosition;
    cameraTargetRef.current = e.detail.cameraTarget;
  };

  const dragStart = (e: any) => {
    dragItemRef.current = parseInt(e.target.dataset.idx);
  };

  const dragEnter = (e: any) => {
    dragOverItemRef.current = parseInt(e.currentTarget.dataset.idx);
  };

  const drop = () => {
    // reorder annotations
    const copyListItems = [...annotations];
    const dragItemContent = copyListItems[dragItemRef.current as number];
    copyListItems.splice(dragItemRef.current as number, 1);
    copyListItems.splice(dragOverItemRef.current as number, 0, dragItemContent);
    dragItemRef.current = null;
    setAnnotations(copyListItems);
  };

  // Form validation
  // const [errors, setErrors] = useState<Errors>({});

  // const handleValidation = () => {
  //   let tempErrors: Errors = {};
  //   let isValid = true;

  //   if (label!.length <= 0) {
  //     tempErrors['label'] = true;
  //     isValid = false;
  //   }

  //   setErrors({ ...tempErrors });
  //   return isValid;
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // let isValidForm = handleValidation();

    // if (isValidForm) { // using inline validation for now
    const copyListItems = [...annotations];
    const updatedItem = {
      ...copyListItems[editIdx as number],
      label,
      description,
      ...(cameraPositionRef.current !== undefined && { cameraPosition: cameraPositionRef.current }),
      ...(cameraTargetRef.current !== undefined && { cameraTarget: cameraTargetRef.current }),
    };
    const updatedListItems = [
      ...copyListItems.slice(0, editIdx as number),
      updatedItem,
      ...copyListItems.slice((editIdx as number) + 1),
    ];
    setAnnotations(updatedListItems);
    setLabel('');
    setDescription('');
    setEditIdx(null);
    // }
  };

  function deleteAnnotation(idx: number) {
    const annotation = annotations[idx];
    const message = annotation.label
      ? `Are you sure you want to delete the annotation "${annotation.label}"?`
      : 'Are you sure you want to delete this annotation?';

    if (window.confirm(message)) {
      setAnnotations(annotations.filter((_, i) => i !== idx));
    }
  }

  return (
    <div className="mt-4 grid gap-y-4">
      {annotations.length ? (
        annotations.map((anno: Annotation, idx) => {
          return (
            <div
              key={idx}
              className={clsx('flex items-center justify-between', {
                'cursor-move': editIdx === null,
              })}
              draggable={editIdx === null}
              onDragStart={(e) => dragStart(e)}
              onDragEnter={(e) => dragEnter(e)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={drop}
              data-idx={idx}>
              {editIdx === idx && (
                <form onSubmit={handleSubmit} className="flex items-end justify-between w-full py-2">
                  <div className="flex flex-col w-full mr-2">
                    <input
                      type="text"
                      placeholder="Label"
                      className="text-xs text-black mb-1 p-1"
                      defaultValue={anno.label}
                      required
                      maxLength={64}
                      onChange={(e) => {
                        setLabel(e.target.value);
                      }}
                    />
                    <textarea
                      placeholder="Description"
                      className="text-xs p-1 break-words text-black h-12"
                      defaultValue={anno.description}
                      maxLength={256}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
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
                    <h3 className="text-white font-medium text-sm md:text-md line-clamp-1 pr-1">{`${idx + 1}. ${
                      anno.label || 'no label'
                    }`}</h3>
                    <p className="text-white text-xs text-zinc-400 dark:text-zinc-400 line-clamp-1 pr-1">
                      {anno.description}
                    </p>
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
                        deleteAnnotation(idx);
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
        })
      ) : (
        <div className="text-white text-center">No annotations</div>
      )}
    </div>
  );
}
