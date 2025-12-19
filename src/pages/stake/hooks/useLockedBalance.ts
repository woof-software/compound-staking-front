import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { LockManagerAbi } from '@/shared/abis/LockManagerAbi';

export function useLockedBalance(address?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.LOCK_MANAGER_ADDRESS,
    abi: LockManagerAbi,
    functionName: 'getActiveLock',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const shema = z
    .object({
      amount: z.bigint(),
      duration: z.number().int().nonnegative(),
      startTime: z.number().int().nonnegative()
    })
    .optional();

  return {
    data: shema.parse(data),
    ...query
  };
}
