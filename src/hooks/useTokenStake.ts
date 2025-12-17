import { type Address, encodeFunctionData, parseUnits } from 'viem';
import { useConnection, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useTokenStake() {
  const { address } = useConnection();

  const { sendTransactionAsync: sendTx, data: hash, isPending: isTransactionPending, ...query } = useSendTransaction();

  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash: hash
  });

  const stake = async (delegatee: Address, amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, ENV.BASE_TOKEN_DECIMALS);

    const stakeData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, parsedAmount]
    });

    await sendTx({
      to: ENV.STAKING_VAULT_ADDRESS,
      data: stakeData
    });
  };

  return {
    stake,
    isPending: isTransactionPending || isTransactionConfirming,
    isStakeSuccess: isTransactionSuccess,
    ...query
  };
}
