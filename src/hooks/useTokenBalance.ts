import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export function useTokenBalance(address?: Address, tokenAddress?: Address) {
  const { data, ...query } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  let result: bigint | undefined;

  if (typeof data === 'bigint') {
    result = data;
  }

  return {
    data: result,
    ...query
  };
}
