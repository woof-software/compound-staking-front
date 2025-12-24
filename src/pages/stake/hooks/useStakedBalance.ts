import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useStakedBalance(address?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const shema = z
    .object({
      principal: z.bigint(),
      stakeTimestamp: z.number().int().nonnegative(),
      lastClaimTime: z.number().int().nonnegative()
    })
    .optional();

  return {
    data: shema.parse(data),
    ...query
  };
}
