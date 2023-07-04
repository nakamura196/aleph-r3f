import React, { useLayoutEffect, useRef } from 'react';

import { default as Aleph } from '../components/Aleph';
import register from '../lib/preact-custom-element/preact-custom-element';
// import { useCustomEvent } from './helpers/use-custom-event';
import { AlephProps } from 'src/types';

interface AlephAttributes {
  src: string;
}

interface WCAlephProps extends AlephProps {
  __registerPublicApi: (component: any) => void;
}

function AlephWebComponent(props: WCAlephProps & AlephAttributes) {
  const webComponent = useRef<HTMLElement>();

  useLayoutEffect(() => {
    if (props.__registerPublicApi) {
      props.__registerPublicApi((component: any) => {
        webComponent.current = component;
      });
    }
  }, []);

  // const handleOnChange = useCustomEvent(webComponent, 'resource-changed', (e) => e);

  return (
    <Aleph {...props} />
    // <Aleph {...props} onResourceChanged={handleOnChange} orientation={'vertical'} />
  );
}

const alephProps = ['src'];

if (typeof window !== 'undefined') {
  register(AlephWebComponent, 'aleph', alephProps, {
    shadow: false,
    onConstruct(instance: any) {
      instance._props = {
        __registerPublicApi: (api: any) => {
          Object.assign(instance, api(instance));
        },
      };
    },
  });
}
