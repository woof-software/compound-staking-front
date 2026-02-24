import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useUserAPR(address?: string, chainId?: number) {
  const { read } = useStakingVaultContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.stakingVault.userApr(address, chainId),
    queryFn: () => {
      if (!read || !address) return;

      return read.aprWadOf(address);
    },
    enabled: !!address
  });

  const schema = z.bigint().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
