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
 * @param limit
 *
 * @returns A shortened string in the format `xxxx...yyyy` or undefined if address is not provided.
 */
export function sliceAddress(address: string, limit = 4) {
  return `${address.slice(0, limit + 2)}...${address.slice(limit * -1)}`;
}
