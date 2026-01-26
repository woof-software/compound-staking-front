import { MockStakingVault__factory } from '@woof-software/compound-staked-comp-artifacts/types';

import { ENV } from '@/consts/env';
import { getEthersProvider, getEthersSigner } from '@/lib/utils/wagmi';
import { config } from '@/shared/config/wagmiConfig';

export function getStakingVaultRead(chainId: number) {
  const provider = getEthersProvider(config, { chainId });

  return MockStakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, provider);
}

export async function getStakingVaultWrite(chainId: number) {
  const signer = await getEthersSigner(config, { chainId });

  return MockStakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, signer);
}
