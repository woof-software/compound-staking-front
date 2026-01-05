import { type ReactNode, useEffect, useRef, useState } from 'react';

export type DurationProps = {
  end: number;
  render: (secondsLeft: number) => ReactNode;
};

export function Duration(props: DurationProps) {
  const { end, render } = props;

  const [value, setValue] = useState(0);
  const last = useRef(-1);

  useEffect(() => {
    if (!end) return;

    let id = 0;

    const iterate = () => {
      const leftMs = end - Date.now();
      const next = Math.max(0, Math.ceil(leftMs / 1000));

      if (next !== last.current) {
        last.current = next;
        setValue(next);
      }

      if (leftMs <= 0) return;
      id = requestAnimationFrame(iterate);
    };

    id = requestAnimationFrame(iterate);
    return () => cancelAnimationFrame(id);
  }, [end]);

  return render(value);
}
