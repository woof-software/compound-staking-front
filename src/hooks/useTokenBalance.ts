import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

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

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
