import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useStatisticStakingAPR(chainId?: number) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.baseApr([chainId]),
    queryFn: () => {
      if (!read) return;

      return read.getBaseAprWad();
    }
  });

  const schema = z.bigint().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
