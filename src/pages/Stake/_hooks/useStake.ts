import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { BASE_TOKEN_DECIMALS, MOCK_BASE_TOKEN_ADDRESS, MOCK_STAKING_VAULT_ADDRESS } from '@/consts/common';
import { MockStakingVaultAbi } from '@/shared/abis/MockStakingVault.abi';

export function useStakeDev() {
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

  const stakeDev = (delegatee: `0x${string}`, amount: string) => {
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
    stakeError
  };
}
