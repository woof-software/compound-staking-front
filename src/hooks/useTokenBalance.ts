import { useCallback } from 'react';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { readContractQueryKey } from 'wagmi/query';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

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

export function tokenBalanceQueryKey(args: { chainId?: number; owner?: Address; token?: Address }) {
  const { chainId, owner, token } = args;

  if (!owner || !token) return null;

  return readContractQueryKey({
    chainId,
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner]
  });
}

export function useInvalidateTokenBalance() {
  const queryClient = useQueryClient();

  return useCallback(
    async (args: { chainId: number; owner?: Address; token?: Address }) => {
      const key = tokenBalanceQueryKey(args);
      if (!key) return;

      await queryClient.invalidateQueries({ queryKey: key });
    },
    [queryClient]
  );
}
