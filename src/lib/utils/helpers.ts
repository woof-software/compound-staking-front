import dayjs from 'dayjs';
import { type Address, getAddress } from 'viem';
import { getDeployment } from '@woof-software/compound-staked-comp-artifacts/deployments';

import { type Delegate, DELEGATES } from '@/consts/common';
import { ENV } from '@/consts/env';

type Contracts = {
  BASE_TOKEN_ADDRESS: Address | undefined;
  STAKED_TOKEN_ADDRESS: Address | undefined;
  STAKING_VAULT_ADDRESS: Address | undefined;
  LOCK_MANAGER_ADDRESS: Address | undefined;
  SUBACCOUNT_MANAGER_ADDRESS: Address | undefined;
  VESTING_MANAGER_ADDRESS: Address | undefined;
};

export function getImgPath(src: string) {
  return `/src/assets${src}`;
}

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

export function getAddressContracts(chainId?: number): Contracts {
  if (!chainId) {
    return {
      BASE_TOKEN_ADDRESS: undefined,
      STAKED_TOKEN_ADDRESS: undefined,
      STAKING_VAULT_ADDRESS: undefined,
      LOCK_MANAGER_ADDRESS: undefined,
      SUBACCOUNT_MANAGER_ADDRESS: undefined,
      VESTING_MANAGER_ADDRESS: undefined
    };
  }

  const BASE_TOKEN_ADDRESS = getAddress(getDeployment(chainId, 'MockComp').address);
  const STAKED_TOKEN_ADDRESS = getAddress(getDeployment(chainId, 'MockStComp').address);
  const STAKING_VAULT_ADDRESS = getAddress(getDeployment(chainId, 'MockStakingVault').address);
  const LOCK_MANAGER_ADDRESS = getAddress(getDeployment(chainId, 'LockManager').address);
  const SUBACCOUNT_MANAGER_ADDRESS = getAddress(getDeployment(chainId, 'SubAccountManager').address);
  const VESTING_MANAGER_ADDRESS = getAddress(getDeployment(chainId, 'VestingManager').address);

  return {
    BASE_TOKEN_ADDRESS,
    STAKED_TOKEN_ADDRESS,
    STAKING_VAULT_ADDRESS,
    LOCK_MANAGER_ADDRESS,
    SUBACCOUNT_MANAGER_ADDRESS,
    VESTING_MANAGER_ADDRESS
  };
}

export function getDelegateByAddress(delegateAddress: Address | undefined, delegates: Delegate[] = DELEGATES) {
  if (!delegateAddress) return undefined;

  const target = delegates.find((d) => d.address.toLowerCase() === delegateAddress.toLowerCase());

  return target ?? { name: undefined, address: delegateAddress };
}
