import { type Address, isAddress } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useVestingManagerContract } from '@/hooks/useVestingManagerContract';
import { queryKeys } from '@/shared/query-keys';

export function useVestingClaim(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useVestingManagerContract(chainId);

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (address: Address) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.claim(address);

      const hash = isAddress(tx.hash) ? tx.hash : undefined;

      const receipt = await tx.wait();

      return {
        hash,
        receipt
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vestingManager.root() });
    }
  });

  return {
    isPending,
    isSuccess,
    sendTransactionAsync: mutateAsync
  };
}
