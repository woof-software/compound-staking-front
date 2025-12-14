import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useConnection, useReadContract } from 'wagmi';

import { COMP_ADDRESS, COMP_DECIMALS, COMP_PRICE_FEED_DECIMALS, COMP_USD_PRICE_FEED } from '@/consts/common';
import { COMPPriceFeedAbi } from '@/shared/abis/COMPPriceFeedAbi';

export function useCompBalance() {
  const { address } = useConnection();

  const { data: compBalanceData } = useReadContract({
    address: COMP_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  });

  const { data: latestRoundData } = useReadContract({
    address: COMP_USD_PRICE_FEED,
    abi: COMPPriceFeedAbi,
    functionName: 'latestRoundData'
  });

  const compPriceUsd = useMemo(() => {
    if (!latestRoundData) return 0;

    const [, answer] = latestRoundData as readonly [
      bigint, // roundId
      bigint, // answer
      bigint, // startedAt
      bigint, // updatedAt
      bigint // answeredInRound
    ];

    return Number(formatUnits(answer, COMP_PRICE_FEED_DECIMALS));
  }, [latestRoundData]);

  const compWalletBalance = useMemo(() => {
    if (!compBalanceData) return 0;
    return Number(formatUnits(compBalanceData, COMP_DECIMALS));
  }, [compBalanceData]);

  return {
    compPriceUsd,
    compWalletBalance
  };
}

// export function useStakeDev({ onIsPendingToggle }: UseStakeDevArgs) {
//   const { address } = useAccount();
//
//   // approve
//   const {
//     writeContract: writeApprove,
//     data: approveHash,
//     isPending: isApprovePending,
//     error: approveError
//   } = useWriteContract();
//
//   const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
//     hash: approveHash
//   });
//
//   // stake
//   const {
//     writeContract: writeStake,
//     data: stakeHash,
//     isPending: isStakePending,
//     error: stakeError
//   } = useWriteContract();
//
//   const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
//     hash: stakeHash
//   });
//
//   const { data: rawStakeBalance, refetch: refetchStake } = useReadContract({
//     address: STAKED_TOKEN_ADDRESS,
//     abi: StakedBaseTokenAbi,
//     functionName: 'balanceOf',
//     args: address ? [address] : undefined,
//     query: {
//       enabled: Boolean(address)
//     }
//   });
//
//   const stakedBalance = (rawStakeBalance ?? 0n) as bigint;
//   const showWarning = stakedBalance > 0n;
//
//   const isLoading = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming;
//
//   const stakeDev = (delegatee: `0x${string}`, amount: string) => {
//     if (!address) throw new Error('Connect wallet first');
//
//     const parsedAmount = parseUnits(amount, BASE_TOKEN_DECIMALS);
//
//     // 1) approve baseToken -> staking vault
//     writeApprove({
//       address: MOCK_BASE_TOKEN_ADDRESS,
//       abi: erc20Abi,
//       functionName: 'approve',
//       args: [MOCK_STAKING_VAULT_ADDRESS, parsedAmount]
//     });
//
//     // 2) stake(delegatee, amount)
//     writeStake({
//       address: MOCK_STAKING_VAULT_ADDRESS,
//       abi: MockStakingVaultAbi,
//       functionName: 'stake',
//       args: [delegatee, parsedAmount]
//     });
//   };
//
//   useEffect(() => {
//     onIsPendingToggle?.(isLoading);
//   }, [isLoading, onIsPendingToggle]);
//
//   console.log('rawStakeBalance=>', rawStakeBalance);
//
//   return {
//     stakeDev,
//
//     // approve
//     approveHash,
//     isApprovePending,
//     isApproveConfirming,
//     isApproveSuccess,
//     approveError,
//
//     // stake
//     stakeHash,
//     isStakePending,
//     isStakeConfirming,
//     isStakeSuccess,
//     stakeError,
//
//     showWarning,
//     isLoading,
//     refetchStake
//   };
// }
