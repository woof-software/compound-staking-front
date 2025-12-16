import { useCallback, useEffect } from 'react';
import { type Address, encodeFunctionData, parseUnits } from 'viem';
import { useConnection, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { ENV } from '@/consts/env';
import { useWalletStore } from '@/hooks/useWallet';
import { BaseTokenAbi } from '@/shared/abis/BaseTokenAbi';
import { StakedTokenAbi } from '@/shared/abis/StakedTokenAbi';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

type COMPBalanceType = {
  principal: bigint;
  stakeTimestamp: number;
  lastClaimTime: number;
};

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

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: ENV.BASE_TOKEN_ADDRESS,
    abi: BaseTokenAbi,
    functionName: 'allowance',
    args: address ? [address, ENV.STAKING_VAULT_ADDRESS] : undefined,
    query: { enabled: !!address }
  });

  const allowance = (allowanceData ?? 0n) as bigint;

  // COMP balance
  const {
    data: COMPBalanceData,
    isFetching: isCOMPBalanceFetching,
    refetch: refetchCOMPBalance
  } = useReadContract({
    address: ENV.STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const COMPBalance = (COMPBalanceData as COMPBalanceType) ?? {
    principal: 0n,
    stakeTimestamp: 0,
    lastClaimTime: 0
  };

  // stCOMP balance
  const {
    data: stakedCOMPBalanceData,
    isFetching: isStakedCOMPBalanceFetching,
    refetch: refetchStakedCOMPBalance
  } = useReadContract({
    address: ENV.STAKED_TOKEN_ADDRESS,
    abi: StakedTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const stakedCOMPBalance = (stakedCOMPBalanceData ?? 0n) as bigint;

  const isLoading = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming;

  const refetchStakeData = useCallback(() => {
    refetchCOMPBalance();
    refetchStakedCOMPBalance();
  }, [refetchCOMPBalance, refetchStakedCOMPBalance]);

  const approve = async (amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, ENV.BASE_TOKEN_DECIMALS);

    const approveData = encodeFunctionData({
      abi: BaseTokenAbi,
      functionName: 'approve',
      args: [ENV.STAKING_VAULT_ADDRESS, parsedAmount]
    });

    await sendApproveTx({
      to: ENV.BASE_TOKEN_ADDRESS,
      data: approveData
    });

    await refetchAllowance();
  };

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

  useEffect(() => {
    if (isStakeSuccess) {
      refetchStakeData();
    }
  }, [isStakeSuccess, refetchStakeData]);

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

    COMPBalance,
    isCOMPBalanceFetching,

    stakedCOMPBalance,
    isStakedCOMPBalanceFetching,

    allowance,
    isLoading,

    refetchStakeData
  };
}
