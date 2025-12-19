import { type Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useVirtualBalance(address?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'virtualBalanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
