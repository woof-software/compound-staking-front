import { useMemo } from 'react';
import type { Address } from 'viem';
import { type SubAccount, SubAccount__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useSubAccountContract(chainId?: number, owner?: Address) {
  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!owner) return null;

    return SubAccount__factory.connect(owner, provider);
  }, [owner, provider]);

  const writeContract = async (): Promise<SubAccount | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !owner) return null;

      return SubAccount__factory.connect(owner, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
