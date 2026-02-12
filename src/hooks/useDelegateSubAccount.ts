import { type Address, isAddress } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useSubAccountManagerContract } from '@/hooks/useSubAccountManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useDelegateSubAccount(chainId?: number, owner?: Address) {
  const { read } = useSubAccountManagerContract(chainId);

  const { data, ...query } = useQuery<string | undefined>({
    queryKey: queryKeys.subAccountManager.subAccountOf([chainId, owner]),
    enabled: !!owner,
    queryFn: () => {
      if (!owner || !read) return;

      return read.subAccountOf(owner);
    }
  });

  const addressSchema = z
    .string()
    .refine((v): v is Address => isAddress(v), { message: 'Invalid wallet address' })
    .optional();

  return {
    data: addressSchema.parse(data),
    ...query
  };
}
