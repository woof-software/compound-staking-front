import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { z } from 'zod';

export function useAllowance(owner?: Address, tokenAddress?: Address, spender?: Address) {
  const { data, ...query } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender }
  });

  return {
    data: z.bigint().optional().parse(data),
    ...query
  };
}
