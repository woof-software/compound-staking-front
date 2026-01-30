import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useVestingManagerContract } from '@/hooks/useVestingManagerContract';
import { queryKeys } from '@/shared/query-keys';

const schema = z
  .array(
    z.object({
      amount: z.bigint(),
      claimedAmount: z.bigint(),
      startTime: z.bigint(),
      duration: z.bigint()
    })
  )
  .optional();

export type VestingPositionInfoDto = z.infer<typeof schema>;

export function useVestingPosition(chainId?: number, address?: Address) {
  const { read } = useVestingManagerContract(chainId);

  const { data, ...query } = useQuery<VestingPositionInfoDto | undefined>({
    queryKey: queryKeys.vestingManager.activeVestingsOf([chainId]),
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      const res = await read.activeVestingsOf(address);

      return res.map((v) => ({
        amount: v.amount,
        claimedAmount: v.claimedAmount,
        startTime: v.startTime,
        duration: v.duration
      }));
    }
  });

  return {
    data: schema.parse(data),
    ...query
  };
}
