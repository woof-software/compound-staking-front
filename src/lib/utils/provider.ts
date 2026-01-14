import { FallbackProvider, JsonRpcProvider } from 'ethers';
import type { Chain, Client, Transport } from 'viem';
import { type Config, getClient } from '@wagmi/core';

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
