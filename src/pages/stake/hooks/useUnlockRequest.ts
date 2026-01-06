import { useCallback } from 'react';
import { type Address, encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { LockManagerAbi } from '@/shared/abis/LockManagerAbi';

export function useUnlockRequest() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async (token: Address) => {
    const unlockRequestData = encodeFunctionData({
      abi: LockManagerAbi,
      functionName: 'unlock'
    });

    return sendTransactionAsync({
      to: token,
      data: unlockRequestData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
