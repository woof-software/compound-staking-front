import { useEffect } from 'react';

export function useOutsideClick<T extends HTMLElement>(target: () => T | null, handler: (event: MouseEvent) => void) {
  useEffect(() => {
    const _target = target();

    if (!_target) return;

    const handleClick = (event: MouseEvent) => {
      const source = event.target;

      if (!(source instanceof Node)) return;

      if (_target === source || _target.contains(source)) return;

      handler(event);
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [target, handler]);
}
