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

export type RewardRowProps = {
  vestingAmount: number;
  toClaim: number;
  startDate: number;
  endDate: number;
  claimedAmount: number;
  vestingStartDate: number;
  vestingEndDate: number;
  percents: number;
};

export function rewardDto(reward: Reward): RewardRowProps {
  const now = dayjs().unix();

  const vestingStart = normalizeUnixSeconds(reward.startTime ?? 0);
  const totalSec = Math.max(0, reward.duration ?? 0);
  const vestingEnd = vestingStart + totalSec;

  const elapsedSec = totalSec > 0 ? (clamp(now - vestingStart, 0, totalSec) as number) : 0;

  const vestedSoFar = totalSec > 0 ? (reward.amount * BigInt(elapsedSec)) / BigInt(totalSec) : 0n;

  const claimed = reward.claimedAmount ?? 0n;

  const claimable = vestedSoFar > claimed ? vestedSoFar - claimed : 0n;

  const percents = totalSec > 0 ? Math.round((elapsedSec / totalSec) * 100) : 0;

  const vestingAmount = Number(formatUnits(reward.amount, ENV.BASE_TOKEN_DECIMALS));
  const claimedAmount = Number(formatUnits(claimed, ENV.BASE_TOKEN_DECIMALS));
  const toClaim = Number(formatUnits(claimable, ENV.BASE_TOKEN_DECIMALS));

  return {
    vestingAmount,
    toClaim,
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
