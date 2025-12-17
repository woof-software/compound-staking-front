import { type Address, encodeFunctionData } from 'viem';
import { useSendTransaction } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useTokenStake() {
  const { sendTransactionAsync, ...query } = useSendTransaction();

  const _sendTransactionAsync = async (delegatee: Address, amount: bigint) => {
    const stakeData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, amount]
    });

    return sendTransactionAsync({
      to: ENV.STAKING_VAULT_ADDRESS,
      data: stakeData
    });
  };

  return {
    sendTransactionAsync: _sendTransactionAsync,
    ...query,
    sendTransaction: undefined
  };
}
