import { isHash } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

export function useUnstakeRequest(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useStakingVaultContract(chainId);

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async () => {
      const contract = await write();
      if (!contract) return;

      const tx = await contract.unstake();

      const hash = tx.hash;

      return isHash(hash) ? hash : undefined;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.stakingVault.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}
