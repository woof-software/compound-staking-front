import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { REFETCH_TIME_MS } from '@/consts/common';
import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useAvailableRewards(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.availableRewardsOf([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!address) return undefined;

      return await read.availableRewardsOf(address);
    },
    refetchInterval: REFETCH_TIME_MS
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
