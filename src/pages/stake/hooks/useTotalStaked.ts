import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';

export function useTotalStaked(chainId?: number) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: ['multiplierOf', chainId],
    queryFn: async () => {
      return await read.totalStaked();
    }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
