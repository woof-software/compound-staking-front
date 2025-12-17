import { useCallback } from 'react';
import { type Address, encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useUnstakeRequest() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async (token: Address) => {
    const unstakeRequestData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'unstake'
    });

    return sendTransactionAsync({
      to: token,
      data: unstakeRequestData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
