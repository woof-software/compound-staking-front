import type { Address } from 'viem';
import { useReadContract } from 'wagmi';

import { ChainLinkPriceFeedAbi } from '@/shared/abis/chainLinkPriceFeedAbi';

type LatestRoundData = readonly [bigint, bigint, bigint, bigint, bigint];

export function useTokenPrice(priceFeedAddress?: Address) {
  return useReadContract({
    address: priceFeedAddress,
    abi: ChainLinkPriceFeedAbi,
    functionName: 'latestRoundData',
    query: {
      enabled: !!priceFeedAddress,
      select: (d) => (d as LatestRoundData)[1]
    }
  });
}
