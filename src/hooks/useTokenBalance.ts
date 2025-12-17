import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export function useTokenBalance(address?: Address, tokenAddress?: Address) {
  const { data: balanceData, ...query } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  let result;

  if (typeof balanceData === 'bigint') {
    result = balanceData;
  } else {
    result = 0n;
  }

  return {
    data: result,
    ...query
  };
}
