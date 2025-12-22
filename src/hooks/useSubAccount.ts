import type { Address } from 'viem';
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

  const shema = z
    .object({
      delegatee: z.string().transform((v) => v as Address | undefined),
      executableAt: z.bigint().optional(),
      executed: z.boolean().optional()
    })
    .optional();

  return {
    data: shema.parse(data),
    ...query
  };
}
