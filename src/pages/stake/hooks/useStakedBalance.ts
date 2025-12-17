import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

const StakedBalanceSchema = z.object({
  principal: z.bigint(),
  stakeTimestamp: z.number().int().nonnegative(),
  lastClaimTime: z.number().int().nonnegative()
});

export type StakedBalanceType = z.infer<typeof StakedBalanceSchema>;

export function useStakedBalance(address?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  let balance: StakedBalanceType | undefined = undefined;

  if (balanceData) {
    const parsed = StakedBalanceSchema.safeParse(balanceData);

    if (parsed.success) {
      balance = parsed.data;
    }
  }

  return {
    data: balance,
    ...query
  };
}
