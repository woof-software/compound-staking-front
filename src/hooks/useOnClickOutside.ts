import { useEffect, useLayoutEffect, useRef } from 'react';

type MaybeNode<T extends HTMLElement> = T | null;
type TargetGetter<T extends HTMLElement> = () => MaybeNode<T> | MaybeNode<T>[];

export function useOutsideClick<T extends HTMLElement>(target: TargetGetter<T>, handler: (event: MouseEvent) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const nodesRef = useRef<MaybeNode<T>[]>([]);

  useLayoutEffect(() => {
    const res = target();
    nodesRef.current = Array.isArray(res) ? res : [res];
  });

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const source = event.target;
      if (!(source instanceof Node)) return;

      const nodes = nodesRef.current;

      const isInside = nodes.some((node) => node && (node === source || node.contains(source)));
      if (isInside) return;

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);
}
