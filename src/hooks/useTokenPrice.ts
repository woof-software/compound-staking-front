import type { Address } from 'viem';
import { useReadContract } from 'wagmi';

import { ChainLinkPriceFeedAbi } from '@/shared/abis/chainLinkPriceFeedAbi';

export function useTokenPrice(priceFeedAddress?: Address) {
  const { data: latestRoundData, ...query } = useReadContract({
    address: priceFeedAddress,
    abi: ChainLinkPriceFeedAbi,
    functionName: 'latestRoundData'
  });

  let result;

  if (latestRoundData) {
    const [, answer] = latestRoundData as readonly [
      bigint, // roundId
      bigint, // answer
      bigint, // startedAt
      bigint, // updatedAt
      bigint // answeredInRound
    ];

    result = answer;
  }

  return {
    data: result,
    ...query
  };
}
