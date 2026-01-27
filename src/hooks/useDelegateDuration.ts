import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useSubAccountManagerContract } from '@/hooks/useSubAccountManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useDelegateDuration(chainId?: number) {
  const { read } = useSubAccountManagerContract(chainId);

  const { data, ...query } = useQuery<bigint | undefined>({
    queryKey: queryKeys.subAccountManager.delegationDelay([chainId]),
    queryFn: async () => {
      if (!read) return undefined;

      return await read.delegationDelay();
    }
  });

  const schema = z.bigint().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
