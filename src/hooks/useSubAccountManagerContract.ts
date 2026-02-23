import { useMemo } from 'react';
import {
  type SubAccountsManager,
  SubAccountsManager__factory
} from '@woof-software/compound-staked-comp-artifacts/types';

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

    return SubAccountsManager__factory.connect(subaccountManagerAddress, provider);
  }, [subaccountManagerAddress, provider]);

  const writeContract = async (): Promise<SubAccountsManager | null> => {
    try {
      const params = chainId === undefined ? {} : { chainId };
      const signer = await getEthersSigner(config, params);

      if (!signer || !subaccountManagerAddress) return null;

      return SubAccountsManager__factory.connect(subaccountManagerAddress, signer);
    } catch {
      return null;
    }
  };

  return {
    read: readContract,
    write: writeContract
  };
}
