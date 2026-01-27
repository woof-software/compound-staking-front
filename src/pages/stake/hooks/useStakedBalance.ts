import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

const schema = z
  .object({
    principal: z.bigint(),
    stakeTimestamp: z.bigint(),
    lastClaimTime: z.bigint()
  })
  .optional();

export type StakeInfoDto = z.infer<typeof schema>;

export function useStakedBalance(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<StakeInfoDto | undefined>({
    queryKey: queryKeys.stakingVault.stakeInfoOf([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!address || !read) return undefined;

      const res = await read.stakeInfoOf(address);

      return {
        principal: res[0],
        stakeTimestamp: res[1],
        lastClaimTime: res[2]
      };
    }
  });

  return {
    data: schema.parse(data),
    ...query
  };
}
