import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { VestingManagerAbi } from '@/shared/abis/VestingManagerAbi';

export function useVestingPosition(address?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.VESTING_MANAGER_ADDRESS,
    abi: VestingManagerAbi,
    functionName: 'getActiveVestings',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const schema = z
    .array(
      z.object({
        amount: z.bigint(),
        claimedAmount: z.bigint(),
        duration: z.number().int().nonnegative(),
        startTime: z.number().int().nonnegative()
      })
    )
    .optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
