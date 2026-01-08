import { type ReactNode, useEffect, useEffectEvent, useState } from 'react';

export type DurationProps = {
  end: number;
  render: (secondsLeft: number | undefined) => ReactNode;
  unsafeRound?: (value: number) => number;
};

export function Duration(props: DurationProps) {
  const { end, render, unsafeRound = (v) => v } = props;

  const _unsafeRound = useEffectEvent(unsafeRound);

  const [value, setValue] = useState<number>();

  useEffect(() => {
    if (!end) return;

    let id: number;

    const iterate = () => {
      const now = Date.now();

      const tillTheEnd = _unsafeRound(end - now);

      setValue(Math.max(tillTheEnd, 0));

      if (tillTheEnd <= 0) return;

      id = requestAnimationFrame(iterate);
    };

    id = requestAnimationFrame(iterate);

    return () => {
      cancelAnimationFrame(id);
    };
  }, [end]);

  return render(value ?? undefined);
}
