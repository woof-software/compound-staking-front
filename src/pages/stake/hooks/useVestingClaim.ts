import { type Address, isHash } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useVestingManagerContract } from '@/hooks/useVestingManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useVestingClaim(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useVestingManagerContract(chainId);

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async (address: Address) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.claim(address);

      const hash = tx.hash;

      return isHash(hash) ? hash : undefined;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vestingManager.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}
