import { useEffect } from 'react';
import { type Address, erc20Abi, parseUnits } from 'viem';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import {
  BASE_TOKEN_DECIMALS,
  MOCK_BASE_TOKEN_ADDRESS,
  MOCK_STAKING_VAULT_ADDRESS,
  STAKED_TOKEN_ADDRESS
} from '@/consts/common';
import { MockStakingVaultAbi } from '@/shared/abis/MockStakingVault.abi';
import { StakedBaseTokenAbi } from '@/shared/abis/StakedBaseToken.abi';

type UseStakeDevArgs = {
  onIsPendingToggle?: (value: boolean) => void;
};

export function useStakeDev({ onIsPendingToggle }: UseStakeDevArgs) {
  const { address } = useAccount();

  // approve
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  // stake
  const {
    writeContract: writeStake,
    data: stakeHash,
    isPending: isStakePending,
    error: stakeError
  } = useWriteContract();

  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash
  });

  const { data: rawStakeBalance, refetch: refetchStake } = useReadContract({
    address: STAKED_TOKEN_ADDRESS,
    abi: StakedBaseTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  });

  const stakedBalance = (rawStakeBalance ?? 0n) as bigint;
  const showWarning = stakedBalance > 0n;

  const isLoading = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming;

  const stakeDev = (delegatee: Address, amount: string) => {
    if (!address) throw new Error('Connect wallet first');

    const parsedAmount = parseUnits(amount, BASE_TOKEN_DECIMALS);

    // 1) approve baseToken -> staking vault
    writeApprove({
      address: MOCK_BASE_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [MOCK_STAKING_VAULT_ADDRESS, parsedAmount]
    });

    // 2) stake(delegatee, amount)
    writeStake({
      address: MOCK_STAKING_VAULT_ADDRESS,
      abi: MockStakingVaultAbi,
      functionName: 'stake',
      args: [delegatee, parsedAmount]
    });
  };

  useEffect(() => {
    onIsPendingToggle?.(isLoading);
  }, [isLoading, onIsPendingToggle]);

  console.log('rawStakeBalance=>', rawStakeBalance);

  return {
    stakeDev,

    // approve
    approveHash,
    isApprovePending,
    isApproveConfirming,
    isApproveSuccess,
    approveError,

    // stake
    stakeHash,
    isStakePending,
    isStakeConfirming,
    isStakeSuccess,
    stakeError,

    showWarning,
    isLoading,
    refetchStake
  };
}
