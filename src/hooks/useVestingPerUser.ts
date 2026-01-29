import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useVestingManagerContract } from '@/hooks/useVestingManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useVestingPerUser(chainId?: number) {
  const { read } = useVestingManagerContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.vestingManager.MAX_VESTINGS_PER_USER([chainId]),
    queryFn: () => {
      if (!read) return;

      return read.MAX_VESTINGS_PER_USER();
    }
  });

  const schema = z.bigint().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
