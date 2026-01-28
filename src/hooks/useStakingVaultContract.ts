import { useMemo } from 'react';
import { type MockStakingVault, MockStakingVault__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { ENV } from '@/consts/env';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useStakingVaultContract(chainId?: number) {
  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    return MockStakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, provider);
  }, [provider]);

  const writeContract = async (): Promise<MockStakingVault | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);
      if (!signer) return null;

      return MockStakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
