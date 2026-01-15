import { BrowserProvider, FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { type Config, getClient, getConnectorClient } from '@wagmi/core';

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;

  const ensAddress = chain.contracts?.ensRegistry?.address;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ...(ensAddress ? { ensAddress } : {})
  };

  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(({ value }) => {
      return new JsonRpcProvider(value?.url, network);
    });

    return providers.length === 1 ? providers[0] : new FallbackProvider(providers);
  }

  return new JsonRpcProvider(transport.url, network);
}

export function getEthersProvider(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = getClient(config, { chainId });
  if (!client) return;
  return clientToProvider(client);
}

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
