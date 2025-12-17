import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import { useConnection, useSendTransaction } from 'wagmi';

import { ENV } from '@/consts/env';

export function useTokenApprove() {
  const { address } = useConnection();

  const { sendTransactionAsync: sendApproveTx, ...query } = useSendTransaction();

  const approve = async (amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, ENV.BASE_TOKEN_DECIMALS);

    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [ENV.STAKING_VAULT_ADDRESS, parsedAmount]
    });

    await sendApproveTx({
      to: ENV.BASE_TOKEN_ADDRESS,
      data: approveData
    });
  };

  return {
    approve,
    ...query
  };
}
