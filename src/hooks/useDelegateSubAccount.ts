import { type Address, isAddress } from 'viem';
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
    .refine((v): v is Address => isAddress(v), { message: 'Invalid address' })
    .optional();

  return {
    data: addressSchema.parse(data),
    ...query
  };
}
