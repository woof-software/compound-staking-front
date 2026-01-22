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

export type RewardNormalizeRet = {
  vestingAmount: number;
  toClaim: number;
  claimedAmount: number;
  startDate: number;
  endDate: number;
  percents: number;

  vestingAmountRaw: bigint;
  claimedAmountRaw: bigint;
};

export function rewardNormalize(reward: Reward): RewardNormalizeRet {
  const now = dayjs().unix();

  const startDate = normalizeUnixSeconds(reward.startTime ?? 0);
  const totalSec = Math.max(0, reward.duration ?? 0);
  const endDate = startDate + totalSec;

  const elapsedSec = totalSec > 0 ? clamp(now - startDate, 0, totalSec) : 0;

  const amount = reward.amount ?? 0n;
  const claimed = reward.claimedAmount ?? 0n;

  const vestedSoFar = totalSec > 0 ? (amount * BigInt(elapsedSec)) / BigInt(totalSec) : amount;

  const claimableNow = vestedSoFar > claimed ? vestedSoFar - claimed : 0n;

  const percents = totalSec > 0 ? Math.round((elapsedSec / totalSec) * 100) : 100;

  const vestingAmount = Number(formatUnits(amount, ENV.BASE_TOKEN_DECIMALS));
  const claimedAmount = Number(formatUnits(claimed, ENV.BASE_TOKEN_DECIMALS));
  const toClaim = Number(formatUnits(claimableNow, ENV.BASE_TOKEN_DECIMALS));

  return {
    vestingAmount,
    toClaim,
    claimedAmount,
    startDate,
    endDate,
    percents,

    vestingAmountRaw: amount,
    claimedAmountRaw: claimed
  };
}

export function rewardsNormalize(rewards: Reward[] | undefined) {
  return rewards?.map(rewardNormalize) ?? [];
}
