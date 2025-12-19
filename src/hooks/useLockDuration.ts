import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { LockManagerAbi } from '@/shared/abis/LockManagerAbi';

export function useLockDuration(address?: Address) {
  const { data, ...query } = useReadContract({
    address: address,
    abi: LockManagerAbi,
    functionName: 'lockDuration'
  });

  return {
    data: z.number().optional().parse(data),
    ...query
  };
}
