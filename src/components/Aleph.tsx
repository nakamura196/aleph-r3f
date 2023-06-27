import '../style.css';
import { useAlephContext } from '../context/IIIFResourceContext';
import React, { useEffect, useState } from 'react';

import Items from './Items';
import { Orientation } from 'src/types/options';
import { type OnResourceChanged, type Resource } from 'src/types/types';
import { fetch } from '@iiif/vault-helpers/fetch';

interface AlephProps {
  children?: React.ReactNode;
  currentResourceId?: string;
  iiifContent: string;
  onLoad?: (resource: any) => void;
  onResourceChanged?: OnResourceChanged;
  orientation?: Orientation;
  overrides?: Partial<Resource>;
}

export const Aleph: React.FC<AlephProps> = ({
  currentResourceId,
  iiifContent,
  onLoad,
  onResourceChanged,
  orientation = 'vertical',
  overrides,
}) => {
  return <>{iiifContent}</>;

  // const [error, setError] = useState(false);
  // const { dispatch } = useAlephContext();

  // useEffect(() => {
  //   if (currentResourceId) {
  //     dispatch({
  //       type: 'updateCurrentId',
  //       id: currentResourceId,
  //     });
  //   }
  // }, [currentResourceId]);

  // useEffect(() => {
  //   if (!iiifContent) {
  //     return;
  //   }

  //   const controller = new AbortController();

  //   fetch(iiifContent, { signal: controller.signal })
  //     .then((json) => {
  //       // Update Context with Aleph config props
  //       dispatch({
  //         type: 'initialize',
  //         payload: {
  //           currentResourceId: currentResourceId || '',
  //           isControlled: !!currentResourceId,
  //           isLoaded: true,
  //           onResourceChanged,
  //           resource: json,
  //           orientation,
  //           overrides,
  //         },
  //       });
  //       if (onLoad) {
  //         onLoad(json);
  //       }
  //     })
  //     .catch((e) => setError(e));

  //   return () => {
  //     controller.abort();
  //   };
  // }, [iiifContent]);

  // return <Items onResourceChanged={onResourceChanged} />;
};
