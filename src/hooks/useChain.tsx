import { useChainId, useConfig } from 'wagmi';

export function useChainName() {
  const chainId = useChainId();
  const config = useConfig();

  const chain = config.chains.find((c) => c.id === chainId);

  return chain?.name ?? '';
}

export function useChainLogo() {
  const chainId = useChainId();
  const config = useConfig();

  const chain = config.chains.find((c) => c.id === chainId);

  return `/assets/chains/${chain?.id}.svg`;
}
