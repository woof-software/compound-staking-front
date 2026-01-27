import { type Address, isAddress } from 'viem';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { useSubAccountContract } from '@/hooks/useSubAccountContract';
import { queryKeys } from '@/shared/query-keys';

const addressSchema = z.string().refine((v): v is Address => isAddress(v), { message: 'Invalid address' });

const schema = z
  .object({
    delegatee: addressSchema.optional(),
    executableAt: z.bigint().optional(),
    executed: z.boolean().optional()
  })
  .optional();

export type SubAccountInfoDto = z.infer<typeof schema>;

export function useSubAccount(chainId?: number, owner?: Address) {
  const { read } = useSubAccountContract(chainId, owner);

  const { data, ...query } = useQuery<SubAccountInfoDto | undefined>({
    queryKey: queryKeys.subAccount.delegationRequest([chainId, owner]),
    enabled: !!owner,
    queryFn: async () => {
      if (!read) return undefined;

      const res = await read.delegationRequest();

      return {
        delegatee: isAddress(res[0]) ? res[0] : undefined,
        executableAt: res[1],
        executed: res[2]
      };
    }
  });

  return {
    data: schema.parse(data),
    ...query
  };
}
