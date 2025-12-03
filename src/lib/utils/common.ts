import type { ChangeEvent, MouseEvent } from 'react';

/**
 * Prevents the default browser behavior and stops event propagation
 * for mouse or change events in React.
 *
 * Commonly used on clickable elements (e.g. buttons inside cards)
 * to avoid triggering parent click handlers or default browser actions.
 *
 * @param event - The React mouse or change event to cancel and stop from bubbling.
 */
export const preventEventBubbling = (event: MouseEvent<HTMLElement> | ChangeEvent<HTMLInputElement>): void => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Stops event propagation for native browser events.
 *
 * Useful when working with non-React event listeners or
 * when you only need to prevent bubbling without cancelling
 * the default browser behavior.
 *
 * @param event - The native UI or DOM event whose propagation should be stopped.
 */
export function stopPropagation(event: UIEvent | Event) {
  event.stopPropagation();
}

/**
 * A no-operation function that performs no actions and returns undefined.
 * Typically used as a placeholder or default callback.
 *
 * @return Always returns undefined.
 */
export function noop() {}

/**
 * Shortens a blockchain-style address (or any long string) to a
 * human-readable format by keeping the beginning and end and
 * replacing the middle with ellipsis.
 *
 * For example: `0x1234567890abcdef` → `0x12...cdef` (with default params).
 *
 * @param address - The full address (or string) to shorten. If not provided, returns undefined.
 * @param before - Number of characters to keep at the beginning of the address. Default is 4.
 * @param after - Number of characters to keep at the end of the address. Default is 4.
 *
 * @returns A shortened string in the format `xxxx...yyyy` or undefined if address is not provided.
 */
export const sliceAddress = (address?: string, before: number = 4, after: number = 4) => {
  return address && `${address.slice(0, before)}...${address.slice(-after)}`;
};
