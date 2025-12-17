import { type Address } from 'viem';
import { useReadContract } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useStakedVirtualBalance(address?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'virtualBalanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  let result;

  if (typeof balanceData === 'bigint') {
    result = balanceData;
  }

  return {
    data: result,
    ...query
  };
}
