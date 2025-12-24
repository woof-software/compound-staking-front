import { type ReactNode, useEffect, useRef, useState } from 'react';

import { useExecuteAtTime } from '@/hooks/useExecuteAtTime';

export type DurationProps = {
  end: number;
  onChange?: () => void;
  render: (secondsLeft: number) => ReactNode;
};

export function Duration(props: DurationProps) {
  const { end, render, onChange } = props;

  const endAtMsRef = useRef<number | null>(null);
  const finishedCalledRef = useRef(false);
  const startedRef = useRef(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [nextTickAtMs, setNextTickAtMs] = useState<number | undefined>(undefined);

  useEffect(() => {
    finishedCalledRef.current = false;

    const initial = Number.isFinite(end) ? Math.max(0, Math.floor(end)) : 0;
    startedRef.current = initial > 0;

    setSecondsLeft(initial);

    if (initial === 0) {
      endAtMsRef.current = null;
      setNextTickAtMs(undefined);
      return;
    }

    const now = Date.now();
    endAtMsRef.current = now + initial * 1000;

    setNextTickAtMs(now + 1000);
  }, [end]);

  const tick = () => {
    const endAt = endAtMsRef.current;
    if (!endAt || finishedCalledRef.current) return;

    const now = Date.now();
    const leftMs = endAt - now;

    const nextSeconds = Math.max(0, Math.ceil(leftMs / 1000));
    setSecondsLeft(nextSeconds);

    if (nextSeconds === 0) {
      if (startedRef.current && !finishedCalledRef.current) {
        finishedCalledRef.current = true;
        onChange?.();
      }
      setNextTickAtMs(undefined);
      return;
    }

    const remainder = leftMs % 1000;
    const delayMs = remainder === 0 ? 1000 : remainder;
    setNextTickAtMs(now + Math.max(1, delayMs));
  };

  useExecuteAtTime(tick, nextTickAtMs);

  return <>{render(secondsLeft)}</>;
}
