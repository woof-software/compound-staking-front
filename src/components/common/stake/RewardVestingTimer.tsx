import { Duration } from '@/components/common/Duration';
import { VestingTimerLine } from '@/components/common/stake/VestingTimerLine';
import { clamp } from '@/lib/utils/numeric';

export type RewardVestingTimerProps = {
  vestingStartDate: number;
  vestingEndDate: number;
};

export function RewardVestingTimer(props: RewardVestingTimerProps) {
  const { vestingStartDate, vestingEndDate } = props;

  const totalSec = clamp(vestingEndDate - vestingStartDate, 0, Number.MAX_SAFE_INTEGER);

  return (
    <Duration
      end={vestingEndDate * 1000}
      unsafeRound={(msLeft) => Math.max(Math.ceil(msLeft / 1000), 0)}
      render={(secondsLeft = totalSec) => {
        const elapsedSec = clamp(totalSec - secondsLeft, 0, totalSec);

        const progress = clamp((elapsedSec / totalSec) * 100, 0, 100);
        const completedProgress = clamp(progress, 0, 100);
        const remainingProgress = 100 - completedProgress;

        return (
          <VestingTimerLine
            completedProgress={completedProgress}
            remainingProgress={remainingProgress}
            leftSec={secondsLeft}
            totalSec={totalSec}
          />
        );
      }}
    />
  );
}
