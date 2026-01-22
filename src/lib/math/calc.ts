import { max } from '@/lib/utils/numeric';

type VestingToClaimCalc = {
  vestingAmount: bigint;
  claimedAmount: bigint;
  endDate: number;
  startDate: number;
};

export function vestingToClaimCalc(props: VestingToClaimCalc, secondsLeft = 0) {
  const { startDate: vestingStartDate, endDate: vestingEndDate, claimedAmount, vestingAmount } = props;

  const totalSecNum = Math.max(0, vestingEndDate - vestingStartDate);

  const elapsed = BigInt(totalSecNum - secondsLeft);

  const total = BigInt(totalSecNum);

  const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

  const toClaim = max(vested, 0n);

  return toClaim;
}
