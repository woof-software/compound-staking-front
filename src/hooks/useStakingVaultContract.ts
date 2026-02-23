import { useMemo } from 'react';
import { type StakingVault, StakingVault__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { getAddressContracts } from '@/lib/utils/helpers';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useStakingVaultContract(chainId?: number) {
  const { stakingVaultAddress } = getAddressContracts(chainId);

  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!stakingVaultAddress) return null;

    return StakingVault__factory.connect(stakingVaultAddress, provider);
  }, [stakingVaultAddress, provider]);

  const writeContract = async (): Promise<StakingVault | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !stakingVaultAddress) return null;

      return StakingVault__factory.connect(stakingVaultAddress, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
