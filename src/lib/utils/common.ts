import type { SortType } from '@/pages/stake/components/rewards-flow-block/RewardsTable';

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

/**
 * @param row - The source row object that contains the value.
 * @param accessorKey - The key in `row` whose value should be normalized.
 * @param type - Sort type: 'string' | 'number' | 'date'.
 *
 * @returns A primitive value suitable for comparison:
 * - `string` for `type = 'string'`
 * - `number` for `type = 'number'` or `type = 'date'`
 */
export function getComparable<T extends Record<string, unknown>>(
  row: T,
  accessorKey: string,
  type: SortType
): string | number {
  const raw = row[accessorKey as keyof T];

  if (raw === null || raw === undefined) {
    if (type === 'string') return '';
    return 0;
  }

  if (type === 'number') {
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
  }

  if (type === 'date') {
    if (raw instanceof Date) return raw.getTime();
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const t = Date.parse(raw);
      return Number.isNaN(t) ? 0 : t;
    }
    return 0;
  }

  return String(raw);
}
