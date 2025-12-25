import { useCallback } from 'react';
import { type Address, encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { SubAccountAbi } from '@/shared/abis/SubAccountAbi';

type SendApproveArgs = {
  subAddress: Address;
  delegate: Address;
};

export function useDelegateTransaction() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async (args: SendApproveArgs) => {
    const { subAddress, delegate } = args;

    const delegateData = encodeFunctionData({
      abi: SubAccountAbi,
      functionName: 'requestDelegation',
      args: [delegate]
    });

    return sendTransactionAsync({
      to: subAddress,
      data: delegateData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
