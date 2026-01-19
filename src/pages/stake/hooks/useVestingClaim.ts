import { useCallback } from 'react';
import { type Address, encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { ENV } from '@/consts/env';
import { VestingManagerAbi } from '@/shared/abis/VestingManagerAbi';

export function useVestingClaim() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async (recipient: Address) => {
    const vestingData = encodeFunctionData({
      abi: VestingManagerAbi,
      functionName: 'claim',
      args: [recipient]
    });

    return sendTransactionAsync({
      to: ENV.VESTING_MANAGER_ADDRESS,
      data: vestingData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
