import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { SubAccountManagerAbi } from '@/shared/abis/SubAccountManagerAbi';

export function useDelegateSubAccount(owner?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.SUBACCOUNT_MANAGER_ADDRESS,
    abi: SubAccountManagerAbi,
    functionName: 'subAccountOf',
    args: owner ? [owner] : undefined,
    query: { enabled: !!owner }
  });

  const addressSchema = z
    .string()
    .optional()
    .transform((v) => v as Address | undefined);

  return {
    data: addressSchema.parse(data),
    ...query
  };
}
