import { BrowserProvider, JsonRpcSigner } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { type Config, getConnectorClient } from '@wagmi/core';

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;

  const ensAddress = chain.contracts?.ensRegistry?.address;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ...(ensAddress ? { ensAddress } : {})
  };

  const provider = new BrowserProvider(transport, network);

  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

export async function getEthersSigner(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}
