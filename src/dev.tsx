import { Behavior, ViewingDirection, ViewingHint } from '@iiif/vocabulary';
import { Collection, Manifest } from '@iiif/presentation-3';
import { IIIFContentProvider, useIIIFContext } from './context/IIIFResourceContext';
import React, { useEffect } from 'react';

import { Orientation } from './types/options';
import ReactDOM from 'react-dom/client';
import { ResourceIds } from './types/types';
import { Aleph } from './index';
import { useControls } from 'leva';
import { useState } from 'react';

const Wrapper = () => {
  // const url = new URL(window.location.href);
  // const contentState = url.searchParams.get('iiif-content');
  const { dispatch, state } = useIIIFContext();

  const options = {
    // ...(contentState && { 'iiif-content': contentState }),
    'Flight Helmet': 'https://iiif-3d-manifests.netlify.app/collection/gltf/flight-helmet/index.json',
    'Frog (Draco)': 'https://aleph-fixtures.netlify.app/collection/gltf/frog-draco/index.json',
  };

  const [resource, setResource] = useState<Manifest | Collection>();
  const [resourceIds, setResourceIds] = useState<ResourceIds>({
    current: '',
    next: undefined,
    previous: undefined,
  });

  const [{ iiifContent }, setLevaControls] = useControls(() => ({
    iiifContent: {
      // https://iiif-commons.github.io/fixtures/
      options: options,
    },
  }));

  // const [{ ...overrides }, setOverrides] = useControls('overrides', () => ({
  //   behavior: {
  //     options: {
  //       Default: undefined,
  //       Paged: Behavior.PAGED,
  //       'Non-Paged': Behavior.NON_PAGED,
  //       Individuals: Behavior.INDIVIDUALS,
  //       Continuous: Behavior.CONTINUOUS,
  //     },
  //   },
  //   viewingDirection: {
  //     options: {
  //       Default: undefined,
  //       'Left to Right': ViewingDirection.LEFT_TO_RIGHT,
  //       'Right to Left': ViewingDirection.RIGHT_TO_LEFT,
  //     },
  //   },
  //   thumbnailSize: {
  //     value: 125,
  //   },
  // }));

  // useEffect(() => {
  //   setLevaControls({
  //     currentResourceId: resourceIds.current,
  //   });
  // }, [resourceIds.current]);

  // useEffect(() => {
  //   dispatch({
  //     type: 'updateOrientation',
  //     orientation: orientation as Orientation,
  //   });
  // }, [orientation]);

  // useEffect(() => {
  //   if (state.resource) {
  //     dispatch({
  //       type: 'updateOverrides',
  //       overrides: overrides as any,
  //     });
  //   }
  // }, [overrides.behavior, overrides.viewingDirection, overrides.thumbnailSize]);

  // const handleNavClick = (direction: 'next' | 'previous') => {
  //   const newId = resourceIds[direction];

  //   if (!newId) {
  //     return;
  //   }
  //   setLevaControls({
  //     currentResourceId: newId,
  //   });
  // };

  return (
    <Aleph iiifContent={iiifContent} />
    // <>
    //   <Aleph
    //     iiifContent={iiifContent}
    //     // @ts-ignore
    //     overrides={overrides}
    //     onLoad={(resource: any) => {
    //       setResource(resource);
    //       setOverrides({
    //         viewingDirection: resource.viewingDirection || ViewingDirection.LEFT_TO_RIGHT,
    //       });
    //     }}
    //     currentResourceId={currentResourceId}
    //     orientation={orientation as Orientation}
    //     onResourceChanged={({ resourceIds }) => {
    //       setResourceIds(resourceIds);
    //     }}
    //   />
    //   <button onClick={() => handleNavClick('previous')} disabled={!resourceIds.previous}>
    //     Prev
    //   </button>
    //   <button onClick={() => handleNavClick('next')} disabled={!resourceIds.next}>
    //     Next
    //   </button>
    // </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IIIFContentProvider>
      <Wrapper />
    </IIIFContentProvider>
  </React.StrictMode>
);
