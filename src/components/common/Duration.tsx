import { type ReactNode, useEffect, useRef, useState } from 'react';

export type DurationProps = {
  end: number;
  onChange?: (secondsLeft: number) => void;
  render: (secondsLeft: number) => ReactNode;
};

function normalizeToMs(ts: number): number {
  return ts < 1e12 ? ts * 1000 : ts;
}

export function Duration(props: DurationProps) {
  const { end, render, onChange } = props;

  const rafIdRef = useRef<number | null>(null);
  const lastSecRef = useRef<number>(Number.NaN);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!end || end <= 0) {
      lastSecRef.current = 0;
      setSecondsLeft(0);
      return;
    }

    const targetMs = normalizeToMs(end);

    const tick = () => {
      const diffMs = targetMs - Date.now();
      const next = Math.max(0, Math.ceil(diffMs / 1000));

      if (next !== lastSecRef.current) {
        lastSecRef.current = next;
        setSecondsLeft(next);
        onChange?.(next);
      }

      if (next > 0) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    lastSecRef.current = Number.NaN;

    tick();

    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [end]);

  return <>{render(secondsLeft)}</>;
}
