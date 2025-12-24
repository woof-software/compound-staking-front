import dayjs from 'dayjs';
import type { Address } from 'viem';

import { ENV } from '@/consts/env';

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

export function getExplorerAddressUrl(address?: Address) {
  if (!address) return ENV.ETHERSCAN_URL;
  return `${ENV.ETHERSCAN_URL}/address/${address}`;
}

export function durationTime(totalSeconds: number) {
  const dur = dayjs.duration(totalSeconds, 'seconds');

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

export function getRemainingSeconds(unlockTimestampSec: number, nowUnix = dayjs().unix()): number {
  if (!unlockTimestampSec) return 0;

  return Math.max(0, unlockTimestampSec - nowUnix);
}

export function normalizeUnixSeconds(ts: number): number {
  return ts > 1e12 ? Math.floor(ts / 1000) : Math.floor(ts);
}
