import { useEffect } from 'react';

function useEvent(eventName: string, handler: (e?: any) => void) {
  useEffect(() => {
    // Add event listener
    window.addEventListener(eventName, handler);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]); // Re-run if eventName or handler changes
}

export default useEvent;
