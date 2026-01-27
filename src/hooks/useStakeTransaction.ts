import { ZeroAddress } from 'ethers';
import { type Address, isAddress } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { queryKeys } from '@/shared/query-keys';

type StakeArgs = {
  amount: bigint;
  delegatee?: Address;
};

export function useStakeTransaction(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useStakingVaultContract(chainId);

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async ({ amount, delegatee }: StakeArgs) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.stake(delegatee ?? ZeroAddress, amount);

      const hash = isAddress(tx.hash) ? tx.hash : undefined;

      const receipt = await tx.wait();

      return {
        hash,
        receipt
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.stakingVault.root() });
    }
  });

  return {
    isPending,
    isSuccess,
    sendTransactionAsync: mutateAsync
  };
}
