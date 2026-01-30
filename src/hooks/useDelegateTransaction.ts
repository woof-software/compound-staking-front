import { type Address } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSubAccountContract } from '@/hooks/useSubAccountContract';
import { getHash } from '@/lib/utils/helpers';
import { queryKeys } from '@/shared/query-keys';

export function useDelegateTransaction(chainId?: number, address?: Address) {
  const queryClient = useQueryClient();

  const { write } = useSubAccountContract(chainId, address);

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async (delegate: Address) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.requestDelegation(delegate);

      const hash = tx.hash;

      return getHash(hash);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subAccount.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}
