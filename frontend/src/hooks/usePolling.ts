
import { useEffect, useRef } from 'react';

export const usePolling = (
  callback: () => void,
  interval: number = 30000, 
  enabled: boolean = true
): void => {
  const savedCallback = useRef<() => void>(() => {

  });

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = (): void => {
      savedCallback.current();
    };

    tick(); 
    const id = setInterval(tick, interval);
    
    return (): void => clearInterval(id);
  }, [interval, enabled]);
};