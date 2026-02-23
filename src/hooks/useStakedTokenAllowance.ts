import { type Address } from 'viem';

import { useAllowance } from '@/hooks/useAllowance';
import { getAddressContracts } from '@/lib/utils/helpers';

export function useStakedTokenAllowance(chainId?: number, owner?: Address) {
  const { stakedTokenAddress, stakingVaultAddress } = getAddressContracts(chainId);

  return useAllowance(owner, stakedTokenAddress, stakingVaultAddress);
}
