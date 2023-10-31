import { useEffect, useState } from 'react';

function useKeyPress(targetKey: string, callback?: () => void): boolean {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  useEffect(() => {
    // Function to handle the keydown event
    function downHandler({ key }: KeyboardEvent) {
      if (key === targetKey) {
        setIsKeyPressed(true);
        if (callback) {
          callback();
        }
      }
    }

    // Function to handle the keyup event
    function upHandler({ key }: KeyboardEvent) {
      if (key === targetKey) {
        setIsKeyPressed(false);
      }
    }

    // Add event listeners
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, callback]);

  return isKeyPressed;
}

export default useKeyPress;
