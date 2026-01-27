import { type Address, isAddress } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSubAccountContract } from '@/hooks/useSubAccountContract';
import { queryKeys } from '@/shared/query-keys';

export function useDelegateTransaction(chainId?: number, address?: Address) {
  const queryClient = useQueryClient();

  const { write } = useSubAccountContract(chainId, address);

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (delegate: Address) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.requestDelegation(delegate);

      const hash = isAddress(tx.hash) ? tx.hash : undefined;

      const receipt = await tx.wait();

      return {
        hash,
        receipt
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subAccount.root() });
    }
  });

  return {
    isPending,
    isSuccess,
    sendTransactionAsync: mutateAsync
  };
}
