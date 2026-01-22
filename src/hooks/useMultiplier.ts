import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { REFETCH_TIME_MS } from '@/consts/common';
import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useMultiplier(address?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'multiplierOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: REFETCH_TIME_MS
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
