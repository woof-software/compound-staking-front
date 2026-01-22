import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { SubAccountManagerAbi } from '@/shared/abis/SubAccountManagerAbi';

export function useDelegateDuration() {
  const { data, ...query } = useReadContract({
    address: ENV.SUBACCOUNT_MANAGER_ADDRESS,
    abi: SubAccountManagerAbi,
    functionName: 'delegationDelay'
  });

  const schema = z.number().int().nonnegative().optional();

  return {
    data: schema.parse(data),
    ...query
  };
}
