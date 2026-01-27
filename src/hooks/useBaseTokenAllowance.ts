import { type Address } from 'viem';

import { useAllowance } from '@/hooks/useAllowance';
import { getAddressContracts } from '@/lib/utils/helpers';

export function useBaseTokenAllowance(chainId?: number, owner?: Address) {
  const { BASE_TOKEN_ADDRESS, STAKING_VAULT_ADDRESS } = getAddressContracts(chainId);

  return useAllowance(owner, BASE_TOKEN_ADDRESS, STAKING_VAULT_ADDRESS);
}
