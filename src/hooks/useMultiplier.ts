import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useMultiplier(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.multiplierOf([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      return await read.multiplierOf(address);
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
