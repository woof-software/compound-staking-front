import { clamp, max } from '@/lib/utils/numeric';

type VestingToClaimCalcArgs = {
  vestingAmount: bigint;
  claimedAmount: bigint;
  endDate: number;
  startDate: number;
  secondsLeft?: number;
};

export function vestingToClaimCalc(args: VestingToClaimCalcArgs) {
  const { startDate, endDate, claimedAmount, vestingAmount, secondsLeft = 0 } = args;

  const totalSecNum = Math.max(0, endDate - startDate);

  const elapsed = BigInt(totalSecNum - secondsLeft);

  const total = BigInt(totalSecNum);

  const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

  const toClaim = max(vested, 0n);

  return toClaim;
}

export function vestingToClaimNow(args: VestingToClaimCalcArgs, nowSec: number) {
  const { startDate, endDate, claimedAmount, vestingAmount } = args;

  const totalSec = Math.max(0, endDate - startDate);

  if (totalSec === 0) return 0n;

  const total = BigInt(totalSec);

  const elapsedRaw = BigInt(nowSec - startDate);
  const elapsed = clamp(elapsedRaw, 0n, total);

  const vestedSoFar = (vestingAmount * elapsed) / total;
  const claimable = vestedSoFar - claimedAmount;

  return max(claimable, 0n);
}
