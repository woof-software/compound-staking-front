import { type ReactNode, useEffect, useRef, useState } from 'react';

export type DurationProps = {
  /** Number of seconds to count down from (e.g. 90 => 90..0) */
  end: number;
  /** Called ONCE when countdown reaches 0 */
  onChange?: () => void;
  /** Render-prop that receives seconds left */
  render: (secondsLeft: number) => ReactNode;
};

export function Duration(props: DurationProps) {
  const { end, render, onChange } = props;

  const rafIdRef = useRef<number | null>(null);
  const lastTickMsRef = useRef<number>(0);
  const finishedCalledRef = useRef<boolean>(false);

  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    finishedCalledRef.current = false;
    lastTickMsRef.current = 0;

    const initial = Number.isFinite(end) ? Math.max(0, Math.floor(end)) : 0;
    setSecondsLeft(initial);

    if (initial === 0) {
      if (!finishedCalledRef.current) {
        finishedCalledRef.current = true;
        onChange?.();
      }
      return;
    }

    const tick = (nowMs: number) => {
      if (lastTickMsRef.current === 0) lastTickMsRef.current = nowMs;

      const elapsedMs = nowMs - lastTickMsRef.current;

      if (elapsedMs >= 1000) {
        const steps = Math.floor(elapsedMs / 1000);
        lastTickMsRef.current += steps * 1000;

        setSecondsLeft((prev) => {
          const next = Math.max(0, prev - steps);

          if (next === 0 && !finishedCalledRef.current) {
            finishedCalledRef.current = true;
            onChange?.();
          }

          return next;
        });
      }

      if (!finishedCalledRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [end, onChange]);

  return <>{render(secondsLeft)}</>;
}
