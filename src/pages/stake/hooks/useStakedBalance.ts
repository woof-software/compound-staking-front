import type { Address } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { REFETCH_TIME_MS } from '@/consts/common';
import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export const StakeInfoSchema = z.object({
  principal: z.bigint(),
  stakeTimestamp: z.bigint(),
  lastClaimTime: z.bigint()
});

export const schemaFlexible = z.union([
  StakeInfoSchema,
  z.tuple([z.bigint(), z.bigint(), z.bigint()]).transform(([principal, stakeTimestamp, lastClaimTime]) => ({
    principal,
    stakeTimestamp,
    lastClaimTime
  }))
]);

export type StakeInfo = z.infer<typeof StakeInfoSchema>;

export function useStakedBalance(chainId?: number, address?: Address) {
  const { read } = useStakingVaultContract(chainId);

  return useQuery<StakeInfo | undefined>({
    queryKey: queryKeys.stakingVault.stakeInfoOf([chainId, address]),
    enabled: !!address,
    queryFn: async () => {
      if (!read || !address) return;

      const res = await read.stakeOf(address);

      return schemaFlexible.parse(res);
    },
    refetchInterval: REFETCH_TIME_MS
  });
}
