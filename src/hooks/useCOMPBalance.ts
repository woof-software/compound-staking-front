import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { COMP_ADDRESS, COMP_DECIMALS, COMP_PRICE_FEED_DECIMALS, COMP_USD_PRICE_FEED } from '@/consts/common';
import { COMPPriceFeedAbi } from '@/shared/abis/COMPPriceFeedAbi';

export function useCompBalance() {
  const { address } = useAccount();

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
