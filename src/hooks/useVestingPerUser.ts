import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { VestingManagerAbi } from '@/shared/abis/VestingManagerAbi';

export function useVestingPerUser() {
  const { data, ...query } = useReadContract({
    address: ENV.VESTING_MANAGER_ADDRESS,
    abi: VestingManagerAbi,
    functionName: 'MAX_VESTINGS_PER_USER'
  });

  const schema = z.number().int().nonnegative().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
