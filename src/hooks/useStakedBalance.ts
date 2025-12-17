import type { Address } from 'viem';
import { useReadContract } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

type COMPBalanceType = {
  principal: bigint;
  stakeTimestamp: number;
  lastClaimTime: number;
};

export function useStakedBalance(address?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const balance = (balanceData as COMPBalanceType) ?? {
    principal: 0n,
    stakeTimestamp: 0,
    lastClaimTime: 0
  };

  return {
    data: balance,
    ...query
  };
}
