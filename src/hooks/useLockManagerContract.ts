import { useMemo } from 'react';
import { type LockManager, LockManager__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { getAddressContracts } from '@/lib/utils/helpers';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useLockManagerContract(chainId?: number) {
  const { LOCK_MANAGER_ADDRESS } = getAddressContracts(chainId);

  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!LOCK_MANAGER_ADDRESS) return null;

    return LockManager__factory.connect(LOCK_MANAGER_ADDRESS, provider);
  }, [provider, LOCK_MANAGER_ADDRESS]);

  const writeContract = async (): Promise<LockManager | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !LOCK_MANAGER_ADDRESS) return null;

      return LockManager__factory.connect(LOCK_MANAGER_ADDRESS, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
