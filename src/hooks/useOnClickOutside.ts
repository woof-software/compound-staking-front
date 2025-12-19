import { useEffect } from 'react';

type MaybeNode<T extends HTMLElement> = T | null;
type TargetGetter<T extends HTMLElement> = () => MaybeNode<T> | MaybeNode<T>[];

export function useOutsideClick<T extends HTMLElement>(target: TargetGetter<T>, handler: (event: MouseEvent) => void) {
  useEffect(() => {
    const _target = target();

    const nodes: Node[] = Array.isArray(_target) ? (_target.filter(Boolean) as Node[]) : _target ? [_target] : [];

    if (nodes.length === 0) return;

    const handleClick = (event: MouseEvent) => {
      const source = event.target;

      if (!(source instanceof Node)) return;

      for (const node of nodes) {
        if (node === source || node.contains(source)) return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [target, handler]);
}
