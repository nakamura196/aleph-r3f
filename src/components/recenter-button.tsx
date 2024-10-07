import { useEventTrigger } from '@/lib/hooks/use-event';

import { Button } from './ui/button';
import { RECENTER } from '@/types';

export function RecenterButton() {
  const triggerRecenterEvent = useEventTrigger(RECENTER);

  return (
    <Button
      className="text-white mt-4"
      onClick={() => {
        triggerRecenterEvent();
      }}>
      Recenter
    </Button>
  );
}