import type { MutableRefObject, RefObject } from 'react';
import { useEffect } from 'react';

export function useAutoFocus<T extends HTMLInputElement = HTMLInputElement>(
  ref?: RefObject<T> | MutableRefObject<T | null>,
  autoFocus?: boolean
) {
  useEffect(() => {
    if (!autoFocus) return;

    const el = (ref as MutableRefObject<T | null>)?.current ?? (ref as RefObject<T>)?.current;

    if (!el) return;

    el.focus();
  }, [autoFocus, ref]);
}
