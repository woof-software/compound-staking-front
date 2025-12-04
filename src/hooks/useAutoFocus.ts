import { RefObject, useEffect } from 'react';

export function useAutoFocus<T extends HTMLInputElement = HTMLInputElement>(
  ref?: RefObject<T>,
  autoFocus?: boolean,
) {
  useEffect(() => {
    if (!autoFocus) return;

    const element = ref?.current;

    if (!element) return;

    element.focus();
  }, [autoFocus, ref]);
}
