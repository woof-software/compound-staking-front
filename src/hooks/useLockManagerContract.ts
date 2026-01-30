import { useMemo } from 'react';
import { type LockManager, LockManager__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { getAddressContracts } from '@/lib/utils/helpers';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useLockManagerContract(chainId?: number) {
  const { lockManagerAddress } = getAddressContracts(chainId);

  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!lockManagerAddress) return null;

    return LockManager__factory.connect(lockManagerAddress, provider);
  }, [provider, lockManagerAddress]);

  const writeContract = async (): Promise<LockManager | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !lockManagerAddress) return null;

      return LockManager__factory.connect(lockManagerAddress, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
