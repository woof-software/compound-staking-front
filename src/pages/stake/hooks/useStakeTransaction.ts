import { useEffect } from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import { useConnection, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { BASE_TOKEN_ADDRESS, BASE_TOKEN_DECIMALS, STAKED_TOKEN_ADDRESS, STAKING_VAULT_ADDRESS } from '@/consts/common';
import { useWalletStore } from '@/hooks/useWallet';
import { BaseTokenAbi } from '@/shared/abis/BaseTokenAbi';
import { StakedTokenAbi } from '@/shared/abis/StakedTokenAbi';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

export function useStakeTransaction() {
  const { onIsPendingToggle } = useWalletStore();

  const { address } = useConnection();

  const { sendTransactionAsync: sendApproveTx, data: approveHash, isPending: isApprovePending } = useSendTransaction();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  const { sendTransactionAsync: sendStakeTx, data: stakeHash, isPending: isStakePending } = useSendTransaction();
  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash
  });

  const {
    data: stakedCOMPBalanceData,
    isFetching: isStakedCOMPBalanceFetching,
    refetch: refetchStakedCOMPBalance
  } = useReadContract({
    address: STAKED_TOKEN_ADDRESS,
    abi: StakedTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const stakedCOMPBalance = (stakedCOMPBalanceData ?? 0n) as bigint;

  const isLoading = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming;

  const approve = async (amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, BASE_TOKEN_DECIMALS);

    const approveData = encodeFunctionData({
      abi: BaseTokenAbi,
      functionName: 'approve',
      args: [STAKING_VAULT_ADDRESS, parsedAmount]
    });

    return sendApproveTx({
      to: BASE_TOKEN_ADDRESS,
      data: approveData
    });
  };

  const stake = async (delegatee: `0x${string}`, amount: string) => {
    if (!address) throw new Error('Connect wallet first');

    const parsedAmount = parseUnits(amount, BASE_TOKEN_DECIMALS);

    const stakeData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, parsedAmount]
    });

    return sendStakeTx({
      to: STAKING_VAULT_ADDRESS,
      data: stakeData
    });
  };

  useEffect(() => {
    if (isStakeSuccess) {
      refetchStakedCOMPBalance();
    }
  }, [isStakeSuccess, refetchStakedCOMPBalance]);

  useEffect(() => {
    onIsPendingToggle(isLoading);
  }, [isLoading]);

  return {
    approve,
    isApprovePending,
    isApproveConfirming,
    isApproveSuccess,

    stake,
    isStakePending,
    isStakeConfirming,
    isStakeSuccess,

    stakedCOMPBalance,
    isStakedCOMPBalanceFetching,

    isLoading
  };
}
