import { type Address } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useStakingVaultContract } from '@/hooks/useStakingVaultContract';
import { getHash } from '@/lib/utils/helpers';
import { queryKeys } from '@/shared/query-keys';

type StakeArgs = {
  amount: bigint;
  delegatee: Address;
};

export function useIncreaseStakeTransaction(chainId?: number) {
  const queryClient = useQueryClient();

  const { write } = useStakingVaultContract(chainId);

  const { mutateAsync, ...query } = useMutation({
    mutationFn: async ({ amount, delegatee }: StakeArgs) => {
      const contract = await write();

      if (!contract) return;

      const tx = await contract.stake(amount, delegatee);

      const hash = tx.hash;

      return getHash(hash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stakingVault.root() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subAccount.root() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subAccountManager.root() });
      queryClient.invalidateQueries({ queryKey: queryKeys.vestingManager.root() });
    }
  });

  return {
    sendTransactionAsync: mutateAsync,
    ...query,
    sendTransaction: undefined
  };
}
