import { max } from '@/lib/utils/numeric';

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
