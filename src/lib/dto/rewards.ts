import dayjs from 'dayjs';
import { formatUnits } from 'viem';

import { ENV } from '@/consts/env';
import { normalizeUnixSeconds } from '@/lib/utils/helpers';
import { clamp } from '@/lib/utils/numeric';

export type Reward = {
  amount: bigint;
  claimedAmount: bigint;
  duration: number;
  startTime: number;
};

export type RewardDtoRet = {
  vestingAmount: number;
  toClaim: number;
  remaining: number;
  startDate: number;
  endDate: number;
  claimedAmount: number;
  vestingStartDate: number;
  vestingEndDate: number;
  percents: number;
};

export function rewardDto(reward: Reward): RewardDtoRet {
  const now = dayjs().unix();

  const vestingStart = normalizeUnixSeconds(reward.startTime ?? 0);
  const totalSec = Math.max(0, reward.duration ?? 0);
  const vestingEnd = vestingStart + totalSec;

  const elapsedSec = totalSec > 0 ? (clamp(now - vestingStart, 0, totalSec) as number) : 0;

  const amount = reward.amount ?? 0n;
  const claimed = reward.claimedAmount ?? 0n;

  const vestedSoFar = totalSec > 0 ? (amount * BigInt(elapsedSec)) / BigInt(totalSec) : 0n;

  const claimableNow = vestedSoFar > claimed ? vestedSoFar - claimed : 0n;
  const remainingTotal = amount > claimed ? amount - claimed : 0n;

  const percents = totalSec > 0 ? Math.round((elapsedSec / totalSec) * 100) : 0;

  const vestingAmount = Number(formatUnits(amount, ENV.BASE_TOKEN_DECIMALS));
  const claimedAmount = Number(formatUnits(claimed, ENV.BASE_TOKEN_DECIMALS));
  const toClaim = Number(formatUnits(claimableNow, ENV.BASE_TOKEN_DECIMALS));
  const remaining = Number(formatUnits(remainingTotal, ENV.BASE_TOKEN_DECIMALS));

  return {
    vestingAmount,
    toClaim,
    remaining,

    claimedAmount,
    startDate: vestingStart,
    endDate: vestingEnd,
    vestingStartDate: vestingStart,
    vestingEndDate: vestingEnd,
    percents
  };
}

export function rewardsDto(rewards: Reward[] | undefined) {
  return rewards?.map(rewardDto) ?? [];
}
