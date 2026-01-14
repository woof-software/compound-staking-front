import { StakingVault__factory } from '@woof-software/compound-staked-comp-artifacts/types/ethers-contracts/factories/StakingVault__factory.js';

import { ENV } from '@/consts/env';
import { getEthersProvider } from '@/lib/utils/provider';
import { getEthersSigner } from '@/lib/utils/singer';
import { config } from '@/shared/config/wagmiConfig';

export function getStakingVaultRead(chainId: number) {
  const provider = getEthersProvider(config, { chainId });

  return StakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, provider);
}

export async function getStakingVaultWrite(chainId: number) {
  const signer = await getEthersSigner(config, { chainId });

  return StakingVault__factory.connect(ENV.STAKING_VAULT_ADDRESS, signer);
}
