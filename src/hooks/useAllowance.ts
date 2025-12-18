import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

export function useAllowance(owner?: Address, tokenAddress?: Address) {
  const { data, ...query } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && tokenAddress ? [owner, tokenAddress] : undefined,
    query: { enabled: !!owner && !!tokenAddress }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
