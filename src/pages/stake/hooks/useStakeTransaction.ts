import { useEffect } from 'react';
import { type Address, encodeFunctionData, parseUnits } from 'viem';
import { useConnection, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { BASE_TOKEN_ADDRESS, BASE_TOKEN_DECIMALS, STAKED_TOKEN_ADDRESS, STAKING_VAULT_ADDRESS } from '@/consts/common';
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
    address: BASE_TOKEN_ADDRESS,
    abi: BaseTokenAbi,
    functionName: 'allowance',
    args: address ? [address, STAKING_VAULT_ADDRESS] : undefined,
    query: { enabled: !!address }
  });

  const allowance = (allowanceData ?? 0n) as bigint;

  // COMP balance
  const {
    data: COMPBalanceData,
    isFetching: isCOMPBalanceFetching,
    refetch: refetchCOMPBalance
  } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: StakingVaultAbi,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  console.log('COMPBalanceData=>', COMPBalanceData);

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

    await sendApproveTx({
      to: BASE_TOKEN_ADDRESS,
      data: approveData
    });

    await refetchAllowance();
  };

  const stake = async (delegatee: Address, amount: string) => {
    if (!address) return;

    const parsedAmount = parseUnits(amount, BASE_TOKEN_DECIMALS);

    const stakeData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, parsedAmount]
    });

    await sendStakeTx({
      to: STAKING_VAULT_ADDRESS,
      data: stakeData
    });
  };

  useEffect(() => {
    if (isStakeSuccess) {
      refetchCOMPBalance();
      refetchStakedCOMPBalance();
    }
  }, [isStakeSuccess, refetchCOMPBalance, refetchStakedCOMPBalance]);

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
    isLoading
  };
}
