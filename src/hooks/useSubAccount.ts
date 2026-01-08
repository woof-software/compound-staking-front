import { type Address, isAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { SubAccountAbi } from '@/shared/abis/SubAccountAbi';

export function useSubAccount(owner?: Address) {
  const { data, ...query } = useReadContract({
    address: owner,
    abi: SubAccountAbi,
    functionName: 'delegationRequest',
    query: { enabled: !!owner }
  });

  const addressSchema = z.string().refine((v): v is Address => isAddress(v), { message: 'Invalid address' });

  const shema = z
    .object({
      delegatee: addressSchema.optional(),
      executableAt: z.bigint().optional(),
      executed: z.boolean().optional()
    })
    .optional();

  return {
    data: shema.parse(data),
    ...query
  };
}
