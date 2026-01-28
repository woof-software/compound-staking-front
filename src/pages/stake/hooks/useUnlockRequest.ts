import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLockManagerContract } from '@/hooks/useLockManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useUnlockRequest(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useLockManagerContract(chainId);

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async () => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.unlock();

      return tx.hash;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.lockManager.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}
