import { isAddress } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLockManagerContract } from '@/hooks/useLockManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useUnlockRequest(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useLockManagerContract(chainId);

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.unlock();

      const hash = isAddress(tx.hash) ? tx.hash : undefined;

      const receipt = await tx.wait();

      return {
        hash,
        receipt
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.lockManager.root() });
    }
  });

  return {
    isPending,
    isSuccess,
    sendTransactionAsync: mutateAsync
  };
}
