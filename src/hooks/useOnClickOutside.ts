import { type RefObject, useEffect } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  target?: RefObject<T | null> | (() => T | null),
  callback?: (event?: Event) => void
): void {
  const currentNode = typeof target === 'function' ? undefined : ((target as RefObject<T | null>)?.current ?? null);

  const getNode = (): T | null => {
    if (typeof target === 'function') return target() ?? null;
    return (target as RefObject<T | null>)?.current ?? null;
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleCheck = (event: Event) => {
      const node = getNode();
      if (!node) return;
      const eventTarget = event.target as Node | null;
      if (!eventTarget) return;
      if (node === eventTarget || node.contains(eventTarget)) return;
      callback?.(event);
    };

    document.addEventListener('mousedown', handleCheck);
    document.addEventListener('touchstart', handleCheck);

    return () => {
      document.removeEventListener('mousedown', handleCheck);
      document.removeEventListener('touchstart', handleCheck);
    };
  }, [currentNode, target, callback]);
}
