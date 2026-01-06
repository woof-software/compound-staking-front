import { useEffect, useEffectEvent } from 'react';

type MaybeNode<T extends HTMLElement> = T | null;
type TargetGetter<T extends HTMLElement> = () => MaybeNode<T> | MaybeNode<T>[];

export function useOutsideClick<T extends HTMLElement>(target: TargetGetter<T>, handler: (event: MouseEvent) => void) {
  const _handler = useEffectEvent(handler);
  const _target = useEffectEvent(target);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const source = event.target;
      if (!(source instanceof Node)) return;

      const nodes = _target();

      const targetArray = Array.isArray(nodes) ? nodes : [nodes];
      const nodesArray = nodes === null ? [] : targetArray;

      const isInside = nodesArray.some((node: MaybeNode<T>) => !!node && (node === source || node.contains(source)));

      if (isInside) return;

      _handler(event);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);
}
