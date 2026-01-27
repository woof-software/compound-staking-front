import { useMemo } from 'react';
import { type VestingManager } from '@woof-software/compound-staked-comp-artifacts/types';
import { VestingManager__factory } from '@woof-software/compound-staked-comp-artifacts/types/factories/contracts/VestingManager__factory.js';

import { getAddressContracts } from '@/lib/utils/helpers';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useVestingManagerContract(chainId?: number) {
  const { VESTING_MANAGER_ADDRESS } = getAddressContracts(chainId);

  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!VESTING_MANAGER_ADDRESS) return null;

    return VestingManager__factory.connect(VESTING_MANAGER_ADDRESS, provider);
  }, [VESTING_MANAGER_ADDRESS, provider]);

  const writeContract = async (): Promise<VestingManager | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !VESTING_MANAGER_ADDRESS) return null;

      return VestingManager__factory.connect(VESTING_MANAGER_ADDRESS, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
