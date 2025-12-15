import { useMemo } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';

import { COMPPriceFeedAbi } from '@/shared/abis/COMPPriceFeedAbi';

export type UseTokenPriceProps = {
  priceFeedAddress: Address;
};

export function useTokenPrice(props: UseTokenPriceProps) {
  const { priceFeedAddress } = props;

  const { data: latestRoundData } = useReadContract({
    address: priceFeedAddress,
    abi: COMPPriceFeedAbi,
    functionName: 'latestRoundData'
  });

  const data = useMemo(() => {
    if (!latestRoundData) return BigInt(0);

    const [, answer] = latestRoundData as readonly [
      bigint, // roundId
      bigint, // answer
      bigint, // startedAt
      bigint, // updatedAt
      bigint // answeredInRound
    ];

    return answer;
  }, [latestRoundData]);

  return {
    data
  };
}
