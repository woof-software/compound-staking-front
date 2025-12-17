import { type Address, encodeFunctionData, parseUnits } from 'viem';
import { useConnection, useSendTransaction } from 'wagmi';

import { ENV } from '@/consts/env';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useTokenStake() {
  const { address } = useConnection();

  const { sendTransactionAsync: sendStakeTx, ...query } = useSendTransaction();

  const stake = async (delegatee: Address, amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, ENV.BASE_TOKEN_DECIMALS);

    const stakeData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, parsedAmount]
    });

    await sendStakeTx({
      to: ENV.STAKING_VAULT_ADDRESS,
      data: stakeData
    });
  };

  return {
    stake,
    ...query
  };
}
