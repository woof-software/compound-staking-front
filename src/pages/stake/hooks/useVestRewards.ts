import { type Hash } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { getHash } from '@/lib/utils/helpers';
import { queryKeys } from '@/shared/query-keys';

export function useVestRewards(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useStakingVaultContract(chainId);

  const { mutateAsync, ...query } = useMutation<Hash | undefined>({
    mutationFn: async () => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.vestRewards();

      const hash = tx.hash;

      return getHash(hash);
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
