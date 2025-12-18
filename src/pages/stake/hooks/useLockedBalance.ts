import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { LockManagerAbi } from '@/shared/abis/LockManagerAbi';

const LockedBalanceSchema = z.object({
  amount: z.bigint(),
  duration: z.number().int().nonnegative(),
  startTime: z.number().int().nonnegative()
});

export type LockedBalanceSchemaType = z.infer<typeof LockedBalanceSchema>;

export function useLockedBalance(address?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: ENV.LOCK_MANAGER_ADDRESS,
    abi: LockManagerAbi,
    functionName: 'getActiveLock',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: lockDuration } = useReadContract({
    address: ENV.LOCK_MANAGER_ADDRESS,
    abi: LockManagerAbi,
    functionName: 'lockDuration'
  });

  let balance: LockedBalanceSchemaType | undefined = undefined;
  const duration: number = Number(lockDuration ?? 0);

  if (balanceData) {
    const parsed = LockedBalanceSchema.safeParse(balanceData);

    if (parsed.success) {
      balance = parsed.data;
    }
  }

  return {
    data: balance,
    lockDuration: duration,
    ...query
  };
}
