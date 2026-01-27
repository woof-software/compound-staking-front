import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useLockManagerContract } from '@/hooks/useLockManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useUnstakeLockDuration(chainId?: number, address?: Address) {
  const { read } = useLockManagerContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.lockManager.lockDuration([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      return await read.lockDuration();
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
