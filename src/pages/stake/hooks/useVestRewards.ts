import { useCallback } from 'react';
import { encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useVestRewards() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async () => {
    const vestRewardsData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'vestRewards'
    });

    return sendTransactionAsync({
      to: ENV.STAKING_VAULT_ADDRESS,
      data: vestRewardsData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
