import { useCallback } from 'react';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';
import { useSendTransaction } from 'wagmi';

type SendApproveArgs = {
  token: Address;
  spender: Address;
  value: bigint;
};

export function useTokenApprove() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = useCallback(async (args: SendApproveArgs) => {
    const { token, spender, value } = args;

    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, value]
    });

    return sendTransactionAsync({
      to: token,
      data: approveData
    });
  }, []);

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
