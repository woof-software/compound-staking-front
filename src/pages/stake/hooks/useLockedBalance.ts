import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useLockManagerContract } from '@/hooks/useLockManagerContract';
import { queryKeys } from '@/shared/query-keys';

const schema = z
  .object({
    amount: z.bigint(),
    duration: z.bigint(),
    startTime: z.bigint()
  })
  .optional();

export type LockedInfoDto = z.infer<typeof schema>;

export function useLockedBalance(chainId?: number, address?: Address) {
  const { read } = useLockManagerContract(chainId);

  const { data, ...query } = useQuery<LockedInfoDto | undefined>({
    queryKey: queryKeys.lockManager.lockDuration([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      const [amount, startTime, duration] = await read.lockOf(address);

      return {
        amount,
        duration,
        startTime
      };
    }
  });

  return {
    data: schema.parse(data),
    ...query
  };
}
