import { type Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { REFETCH_TIME_MS } from '@/consts/common';
import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useVirtualBalance(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.virtualBalanceOf([chainId, address]),
    enabled: !!address,
    queryFn: () => {
      if (!address || !read) return;

      return read.effectiveStakedOf(address);
    },
    refetchInterval: REFETCH_TIME_MS
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
