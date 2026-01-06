import { useEffect, useRef } from 'react';

export function useExecuteAtTime(callback: () => void, executionTimestampMs?: number) {
  const safeCallback = useRef(callback);

  safeCallback.current = callback;

  useEffect(() => {
    if (!executionTimestampMs) return;

    let id: number;

    const iterate = () => {
      const now = Date.now();

      const tillTheEnd = executionTimestampMs - now;

      if (tillTheEnd <= 0) {
        safeCallback.current();
      }

      id = requestAnimationFrame(iterate);
    };

    id = requestAnimationFrame(iterate);

    return () => {
      cancelAnimationFrame(id);
    };
  }, [executionTimestampMs]);
}
