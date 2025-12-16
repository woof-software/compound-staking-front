import type { Hex } from 'viem';

export function getChainLogo(chainId: number) {
  //TODO: add fallback
  if (![1, 10, 130, 137, 2020, 5000, 8453, 42161, 43114, 59144, 534352].includes(chainId)) return;
  return `/assets/chains/${chainId}.svg`;
}

export function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 10:
      return 'Optimism';
    case 130:
      return 'Unichain';
    case 137:
      return 'Polygon';
    case 2020:
      return 'Ronin';
    case 5000:
      return 'Mantle';
    case 8453:
      return 'Base';
    case 42161:
      return 'Arbitrum';
    case 43114:
      return 'Avalance';
    case 59144:
      return 'Linea';
    case 534352:
      return 'Scroll';
    default:
      return 'Unknown';
  }
}

export function getExplorerTxUrl(hash?: Hex) {
  return `${import.meta.env.WALLET_CONNECT_PROJECT_ID}/tx/${hash}`;
}
