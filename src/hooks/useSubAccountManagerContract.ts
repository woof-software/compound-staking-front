import { useMemo } from 'react';
import { type SubAccountManager } from '@woof-software/compound-staked-comp-artifacts/types';
import { SubAccountManager__factory } from '@woof-software/compound-staked-comp-artifacts/types/factories/contracts/SubAccountManager__factory.js';

import { getAddressContracts } from '@/lib/utils/helpers';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function useSubAccountManagerContract(chainId?: number) {
  const { subaccountManagerAddress } = getAddressContracts(chainId);

  const provider = useMemo(() => {
    const params = chainId === undefined ? {} : { chainId };

    return getEthersProvider(config, params);
  }, [chainId]);

  const readContract = useMemo(() => {
    if (!subaccountManagerAddress) return null;

    return SubAccountManager__factory.connect(subaccountManagerAddress, provider);
  }, [subaccountManagerAddress, provider]);

  const writeContract = async (): Promise<SubAccountManager | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !subaccountManagerAddress) return null;

      return SubAccountManager__factory.connect(subaccountManagerAddress, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
