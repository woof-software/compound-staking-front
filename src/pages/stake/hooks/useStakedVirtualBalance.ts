import { type Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';

export function useStakedVirtualBalance(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: ['multiplierOf', chainId, address],
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      return await read.virtualBalanceOf(address);
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
