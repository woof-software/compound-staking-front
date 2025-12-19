import { type Address } from 'viem';

import { ENV } from '@/consts/env';
import { useAllowance } from '@/hooks/useAllowance';

export function useBaseTokenAllowance(owner?: Address) {
  return useAllowance(owner, ENV.BASE_TOKEN_ADDRESS, ENV.STAKING_VAULT_ADDRESS);
}
