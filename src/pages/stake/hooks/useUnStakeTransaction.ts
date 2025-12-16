import { useCallback, useEffect } from 'react';
import { encodeFunctionData } from 'viem';
import { useConnection, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

import { ENV } from '@/consts/env';
import { useStakeStore } from '@/hooks/useStakeStore';
import { useWalletStore } from '@/hooks/useWallet';
import { useStakeTransaction } from '@/pages/stake/hooks/useStakeTransaction';
import { LockManagerAbi } from '@/shared/abis/LockManagerAbi';
import { StakingVaultAbi } from '@/shared/abis/StakingVaultAbi';

type LockedCOMPDataType = {
  amount: bigint;
  duration: number;
  startTime: number;
};

export function useUnStakeTransaction() {
  const { onIsPendingToggle } = useWalletStore();
  const { onIsStakeFlowDisabledToggle } = useStakeStore();

  const { address } = useConnection();

  const { refetchStakeData } = useStakeTransaction();

  const {
    sendTransactionAsync: sendUnstakeRequestTx,
    data: unstakeRequestHash,
    isPending: isUnstakeRequestPending
  } = useSendTransaction();
  const { isLoading: isUnstakeRequestConfirming, isSuccess: isUnstakeRequestSuccess } = useWaitForTransactionReceipt({
    hash: unstakeRequestHash
  });

  const {
    sendTransactionAsync: sendUnlockRequestTx,
    data: unlockRequestHash,
    isPending: isUnlockRequestPending
  } = useSendTransaction();
  const { isLoading: isUnlockRequestConfirming, isSuccess: isUnlockRequestSuccess } = useWaitForTransactionReceipt({
    hash: unlockRequestHash
  });

  const {
    data: lockedCOMPBalanceData,
    isFetching: isLockedCOMPBalanceFetching,
    refetch: refetchLockedCOMPBalanceData
  } = useReadContract({
    address: ENV.LOCK_MANAGER_ADDRESS,
    abi: LockManagerAbi,
    functionName: 'getActiveLock',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const lockedCOMPData: LockedCOMPDataType = (lockedCOMPBalanceData as LockedCOMPDataType) ?? {
    amount: 0n,
    duration: 0,
    startTime: 0
  };

  const hasActiveLock = lockedCOMPData.amount > 0n;

  const isLoading =
    isUnstakeRequestPending || isUnstakeRequestConfirming || isUnlockRequestPending || isUnlockRequestConfirming;

  const unstakeRequest = useCallback(async () => {
    if (!address) return;

    onIsStakeFlowDisabledToggle(true);

    const unstakeRequestData = encodeFunctionData({
      abi: StakingVaultAbi,
      functionName: 'unstake'
    });

    try {
      await sendUnstakeRequestTx({
        to: ENV.STAKING_VAULT_ADDRESS,
        data: unstakeRequestData
      });
    } finally {
      onIsStakeFlowDisabledToggle(false);
    }
  }, [address, sendUnstakeRequestTx, onIsStakeFlowDisabledToggle]);

  const unlockRequest = useCallback(async () => {
    if (!address) return;

    const unlockRequestData = encodeFunctionData({
      abi: LockManagerAbi,
      functionName: 'unlock'
    });

    await sendUnlockRequestTx({
      to: ENV.LOCK_MANAGER_ADDRESS,
      data: unlockRequestData
    });
  }, [address, sendUnlockRequestTx]);

  const onUnstake = useCallback(async () => {
    if (!address) return;

    if (hasActiveLock) {
      await unlockRequest();
    } else {
      await unstakeRequest();
    }
  }, [address, hasActiveLock, unlockRequest, unstakeRequest]);

  useEffect(() => {
    if (isUnstakeRequestSuccess || isUnlockRequestSuccess) {
      refetchStakeData();
      refetchLockedCOMPBalanceData();
    }
  }, [isUnstakeRequestSuccess, isUnlockRequestSuccess]);

  useEffect(() => {
    onIsPendingToggle(isLoading);
  }, [isLoading]);

  return {
    isLoading,

    lockedCOMPData,
    isLockedCOMPBalanceFetching,
    hasActiveLock,

    isUnstakeRequestPending,
    isUnstakeRequestConfirming,
    isUnstakeRequestSuccess,

    isUnlockRequestPending,
    isUnlockRequestConfirming,
    isUnlockRequestSuccess,

    unstakeRequest,
    unlockRequest,
    onUnstake
  };
}
