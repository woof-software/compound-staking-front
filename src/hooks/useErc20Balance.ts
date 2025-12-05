import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { COMP_ADDRESS, COMP_USD_PRICE_FEED, COMPOUND_DECIMALS } from '@/consts/consts';
import { aggregatorV3InterfaceABI } from '@/shared/abis/chainlinkAggregatorV3';

export function useErc20Balance() {
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

  const { data: decimalsData } = useReadContract({
    address: COMP_USD_PRICE_FEED,
    abi: aggregatorV3InterfaceABI,
    functionName: 'decimals'
  });

  const { data: latestRoundData } = useReadContract({
    address: COMP_USD_PRICE_FEED,
    abi: aggregatorV3InterfaceABI,
    functionName: 'latestRoundData'
  });

  const compPriceUsd = useMemo(() => {
    if (!latestRoundData || decimalsData === undefined) return 0;

    const [, answer] = latestRoundData as readonly [
      bigint, // roundId
      bigint, // answer
      bigint, // startedAt
      bigint, // updatedAt
      bigint // answeredInRound
    ];

    const priceDecimals = Number(decimalsData as number);
    return Number(formatUnits(answer, priceDecimals));
  }, [latestRoundData, decimalsData]);

  const compWalletBalance = useMemo(() => {
    if (!compBalanceData) return 0;
    return Number(formatUnits(compBalanceData, COMPOUND_DECIMALS));
  }, [compBalanceData]);

  return {
    compWalletBalance,
    compPriceUsd
  };
}
