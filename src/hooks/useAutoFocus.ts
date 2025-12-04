import { type MutableRefObject, type RefObject, useEffect } from 'react';

export function useAutoFocus<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | MutableRefObject<T | null> | undefined,
  autoFocus?: boolean
) {
  useEffect(() => {
    if (!autoFocus) return;

    const element = ref?.current;

    if (!element) return;

    element.focus();
  }, [autoFocus, ref]);
}
