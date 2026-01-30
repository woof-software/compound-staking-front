import { type Address } from 'viem';

import { useAllowance } from '@/hooks/useAllowance';
import { getAddressContracts } from '@/lib/utils/helpers';

export function useBaseTokenAllowance(chainId?: number, owner?: Address) {
  const { baseTokenAddress, stakingVaultAddress } = getAddressContracts(chainId);

  return useAllowance(owner, baseTokenAddress, stakingVaultAddress);
}
