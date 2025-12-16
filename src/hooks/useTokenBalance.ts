import { type Address } from 'viem';
import { useReadContract } from 'wagmi';

import { COMPAbi } from '@/shared/abis/COMPAbi';

export function useTokenBalance(address?: Address, tokenAddress?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: tokenAddress,
    abi: COMPAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  let result;

  if (balanceData) {
    result = balanceData as bigint;
  }

  return {
    data: result,
    ...query
  };
}
