import { Duration } from '@/components/common/Duration';
import { VestingTimerLine } from '@/components/common/stake/VestingTimerLine';
import { noop } from '@/lib/utils/common';
import { clamp } from '@/lib/utils/numeric';

export type RewardVestingTimerProps = {
  vestingStartDate: number;
  vestingEndDate: number;
  initProgress?: number;
  initialLeftSec?: number;
  onTickSeconds?: (secondsLeft: number) => void;
};

export function RewardVestingTimer(props: RewardVestingTimerProps) {
  const { vestingStartDate, vestingEndDate, initProgress = 0, initialLeftSec = 0, onTickSeconds = noop } = props;

  const totalSec = clamp(vestingEndDate - vestingStartDate, 0, Number.MAX_SAFE_INTEGER);

  if (totalSec <= 0) {
    return (
      <VestingTimerLine
        completedProgress={100}
        remainingProgress={0}
        leftSec={0}
        totalSec={0}
      />
    );
  }

  return (
    <Duration
      end={vestingEndDate * 1000}
      unsafeRound={(msLeft) => Math.max(Math.ceil(msLeft / 1000), 0)}
      onTick={(secondsLeft) => {
        if (secondsLeft > 0) {
          onTickSeconds(secondsLeft);
        }
      }}
      render={(secondsLeft = initialLeftSec) => {
        const elapsedSec = clamp(totalSec - secondsLeft, 0, totalSec);

        const progress = clamp((elapsedSec / totalSec) * 100, 0, 100);
        const completedProgress = clamp(progress, clamp(initProgress, 0, 100), 100);
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
