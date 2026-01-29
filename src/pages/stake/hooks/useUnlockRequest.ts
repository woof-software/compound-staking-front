import { isHash } from 'viem';
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

      const hash = tx.hash;

      return isHash(hash) ? hash : undefined;
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
