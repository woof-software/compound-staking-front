import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useTotalStaked(chainId?: number) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.totalStaked([chainId]),
    queryFn: async () => {
      if (!read) return undefined;

      return await read.totalStaked();
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
