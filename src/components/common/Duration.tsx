import { type ReactNode, useEffect, useRef, useState } from 'react';

export type DurationProps = {
  end: number;
  onChange?: () => void;
  render: (secondsLeft: number) => ReactNode;
};

export function Duration(props: DurationProps) {
  const { end, render, onChange } = props;

  const requestAnimRef = useRef<number | null>(null);
  const lastTickMsRef = useRef<number>(0);
  const finishedCalledRef = useRef<boolean>(false);
  const startedRef = useRef<boolean>(false);

  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    finishedCalledRef.current = false;
    lastTickMsRef.current = 0;

    const initial = Number.isFinite(end) ? Math.max(0, Math.floor(end)) : 0;

    startedRef.current = initial > 0;

    setSecondsLeft(initial);

    if (initial === 0) return;

    const tick = (nowMs: number) => {
      if (lastTickMsRef.current === 0) lastTickMsRef.current = nowMs;

      const elapsedMs = nowMs - lastTickMsRef.current;

      if (elapsedMs >= 1000) {
        const steps = Math.floor(elapsedMs / 1000);
        lastTickMsRef.current += steps * 1000;

        setSecondsLeft((prev) => {
          const next = Math.max(0, prev - steps);

          if (next === 0 && startedRef.current && !finishedCalledRef.current) {
            finishedCalledRef.current = true;
            onChange?.();
          }

          return next;
        });
      }

      if (!finishedCalledRef.current) {
        requestAnimRef.current = requestAnimationFrame(tick);
      } else {
        requestAnimRef.current = null;
      }
    };

    requestAnimRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestAnimRef.current != null) cancelAnimationFrame(requestAnimRef.current);
      requestAnimRef.current = null;
    };
  }, [end, onChange]);

  return <>{render(secondsLeft)}</>;
}
