import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import { useConnection, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { ENV } from '@/consts/env';

export function useTokenApprove() {
  const { address } = useConnection();

  const { sendTransactionAsync: sendTx, data: hash, isPending: isTransactionPending, ...query } = useSendTransaction();

  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash: hash
  });

  const approve = async (amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, ENV.BASE_TOKEN_DECIMALS);

    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [ENV.STAKING_VAULT_ADDRESS, parsedAmount]
    });

    await sendTx({
      to: ENV.BASE_TOKEN_ADDRESS,
      data: approveData
    });
  };

  return {
    approve,
    isPending: isTransactionPending || isTransactionConfirming,
    isApproveSuccess: isTransactionSuccess,
    ...query
  };
}
