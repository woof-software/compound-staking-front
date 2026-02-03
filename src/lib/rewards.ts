import { clamp, max } from '@/lib/utils/numeric';

type VestingToClaimCalcArgs = {
  vestingAmount: bigint;
  claimedAmount: bigint;
  endDate: number;
  startDate: number;
  secondsLeft?: number;
  secondsNow?: number;
};

export function vestingToClaimCalc(args: VestingToClaimCalcArgs) {
  const { startDate, endDate, claimedAmount, vestingAmount, secondsLeft = 0, secondsNow } = args;

  const totalSecNum = Math.max(0, endDate - startDate);

  if (totalSecNum === 0) return 0n;

  const total = BigInt(totalSecNum);

  if (typeof secondsNow === 'number') {
    const elapsedRaw = BigInt(secondsNow - startDate);
    const elapsed = clamp(elapsedRaw, 0n, total);

    const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

    return max(vested, 0n);
  }

  const elapsed = BigInt(totalSecNum - secondsLeft);

  const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

  return max(vested, 0n);
}
