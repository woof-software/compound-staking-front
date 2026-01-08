import type { Address } from 'viem';

import { type Delegate, DELEGATES } from '@/consts/common';

export function useDelegateByAddress(delegateAddress: Address | undefined, delegates: Delegate[] = DELEGATES) {
  if (!delegateAddress) return undefined;

  const target = delegates.find((d) => d.address.toLowerCase() === delegateAddress.toLowerCase());

  return target ?? { name: undefined, address: delegateAddress };
}
