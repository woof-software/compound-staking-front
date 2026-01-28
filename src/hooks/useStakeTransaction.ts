import { ZeroAddress } from 'ethers';
import { type Address } from 'viem';
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

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async ({ amount, delegatee }: StakeArgs) => {
      const contract = await write();
      if (!contract) return;

      const tx = await contract.stake(delegatee ?? ZeroAddress, amount);

      return tx.hash;
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
