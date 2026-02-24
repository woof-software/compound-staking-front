import { type Hex, isHash } from 'viem';
import { z } from 'zod';
import { type Mutation, useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { getHash } from '@/lib/utils/helpers';
import { queryKeys } from '@/shared/query-keys';

export function useUnstakeRequest(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useStakingVaultContract(chainId);

  const { mutateAsync, ...query } = useMutation({
    mutationKey: queryKeys.unstakeRequest.perChain(chainId),
    mutationFn: async () => {
      const contract = await write();
      if (!contract) return;

      const tx = await contract.unstake();

      const hash = tx.hash;

      return getHash(hash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stakingVault.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}

export function useUnstakeRequests(chainId?: number) {
  return useMutationState({
    filters: {
      mutationKey: queryKeys.unstakeRequest.perChain(chainId)
    },
    select: (mutation) => {
      z.string().refine(isHash).optional().parse(mutation.state.data);

      return mutation as Mutation<Hex | undefined>;
    }
  });
}
