import { useEffect } from 'react';

/**
 * Function that returns a DOM node or null. Used to dynamically get target elements.
 *
 * @returns DOM Node to monitor for outside clicks, or null if no element should be monitored
 *
 * @example
 * ```typescript
 * const getElement: UseClickOutsideTarget = () => document.getElementById('my-element');
 * const getRef: UseClickOutsideTarget = () => myRef.current;
 * ```
 */
export type UseClickOutsideTarget = () => Node | null;

/**
 * React hook that detects clicks outside of specified elements and triggers a callback.
 * Useful for implementing dropdowns, modals, or other components that should close when clicking outside.
 *
 * @param elementOrArray - Single target function or array of target functions that return DOM nodes to monitor
 * @param onClickOutside - Optional callback function triggered when a click occurs outside all target elements
 *
 * @example
 * Single element:
 * ```typescript
 * const ref = useRef<HTMLDivElement>(null);
 *
 * useClickOutside(
 *   () => ref.current,
 *   () => setIsOpen(false)
 * );
 * ```
 *
 * @example
 * Multiple elements:
 * ```typescript
 * const modalRef = useRef<HTMLDivElement>(null);
 * const triggerRef = useRef<HTMLButtonElement>(null);
 *
 * useClickOutside(
 *   [() => modalRef.current, () => triggerRef.current],
 *   (event) => {
 *     console.log('Clicked outside modal and trigger');
 *     closeModal();
 *   }
 * );
 * ```
 *
 * @example
 * Conditional monitoring:
 * ```typescript
 * useClickOutside(
 *   () => isOpen ? popoverRef.current : null,
 *   () => setIsOpen(false)
 * );
 * ```
 */
function useClickOutside(
  elementOrArray: UseClickOutsideTarget[] | UseClickOutsideTarget,
  onClickOutside?: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const onClick = (event: MouseEvent | TouchEvent) => {
      if (!onClickOutside) return;

      let _elements: Array<UseClickOutsideTarget>;

      if (Array.isArray(elementOrArray)) {
        _elements = elementOrArray;
      } else {
        _elements = [elementOrArray];
      }

      const { target: source } = event;

      if (!source || !(source instanceof Node)) return;

      let isSourceInsideTarget = false;

      for (const element of _elements) {
        if (isSourceInsideTarget) continue;

        const target = element();

        isSourceInsideTarget = !!(target === source || target?.contains(source));
      }

      if (isSourceInsideTarget) return;

      onClickOutside(event);
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [elementOrArray, onClickOutside]);
}

export { useClickOutside };
