// TODO: move date utils into separate file

import dayjs from 'dayjs';
import { type Address, getAddress, type Hash, isHash } from 'viem';
import { getCompAddress, getDeployment } from '@woof-software/compound-staked-comp-artifacts/deployments';

import { type Delegate, DELEGATES } from '@/consts/common';
import { ENV } from '@/consts/env';
import type { Theme } from '@/hooks/useTheme';

type Contracts = {
  baseTokenAddress: Address | undefined;
  stakedTokenAddress: Address | undefined;
  stakingVaultAddress: Address | undefined;
  lockManagerAddress: Address | undefined;
  subaccountManagerAddress: Address | undefined;
  vestingManagerAddress: Address | undefined;
};

export function getChainLogo(chainId?: number, theme: Omit<Theme, 'system'> = 'light') {
  if (!chainId) return '/assets/chains/fallback-chain.svg';

  const isChainInclude = [1, 11155111, 10, 130, 137, 2020, 5000, 8453, 42161, 43114, 59144, 534352].includes(chainId);

  if (isChainInclude) {
    if (chainId === 137 && theme === 'light') return '/assets/chains/137-light.svg';

    return `/assets/chains/${chainId}.svg`;
  } else {
    return '/assets/chains/fallback-chain.svg';
  }
}

export function getChainName(chainId?: number) {
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

export function getAddressContracts(chainId?: number): Contracts {
  if (!chainId) {
    return {
      baseTokenAddress: undefined,
      stakedTokenAddress: undefined,
      stakingVaultAddress: undefined,
      lockManagerAddress: undefined,
      subaccountManagerAddress: undefined,
      vestingManagerAddress: undefined
    };
  }

  const baseTokenAddress = getAddress(getCompAddress(chainId));
  const stakedTokenAddress = getAddress(getDeployment(chainId, 'StComp').address);
  const stakingVaultAddress = getAddress(getDeployment(chainId, 'StakingVaultProxy').address);
  const lockManagerAddress = getAddress(getDeployment(chainId, 'LockManagerProxy').address);
  const subaccountManagerAddress = getAddress(getDeployment(chainId, 'SubAccountsManagerProxy').address);
  const vestingManagerAddress = getAddress(getDeployment(chainId, 'VestingManagerProxy').address);

  return {
    baseTokenAddress,
    stakedTokenAddress,
    stakingVaultAddress,
    lockManagerAddress,
    subaccountManagerAddress,
    vestingManagerAddress
  };
}

export function getDelegateByAddress(delegateAddress: Address | undefined, delegates: Delegate[] = DELEGATES) {
  if (!delegateAddress) return;

  const target = delegates.find((d) => d.address.toLowerCase() === delegateAddress.toLowerCase());

  return target ?? { name: undefined, address: delegateAddress };
}

export function getHash(hash: string): Hash {
  if (!isHash(hash)) {
    throw new Error('Invalid hash');
  }

  return hash as Hash;
}

/**
 * Conditionally returns a value or a fallback.
 *
 * @example
 * when(true, 'hello'); // 'hello'
 *
 * @example
 * when(false, 'hello'); // undefined
 *
 * @example
 * when(false, 'hello', 'fallback'); // 'fallback'
 *
 * @example
 * const address = when(isConnected, walletAddress);
 * if isConnected === true -> walletAddress
 * if isConnected === false -> undefined
 *
 * @example
 * const amount = when(balance > 0n, balance, 0n); // bigint fallback
 */
export function when<T, R extends undefined>(condition: boolean, value: T, fallback?: R): T | R | undefined {
  return condition ? value : fallback;
}
