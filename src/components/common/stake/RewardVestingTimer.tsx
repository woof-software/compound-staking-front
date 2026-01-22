import { useMemo } from 'react';

import { Duration } from '@/components/common/Duration';
import { Text } from '@/components/ui/Text';
import { noop } from '@/lib/utils/common';
import { FormatTime } from '@/lib/utils/format';
import { clamp } from '@/lib/utils/numeric';

export type RewardVestingTimerProps = {
  vestingStartDate: number;
  vestingEndDate: number;
  initProgress?: number;
  initialLeftSec?: number;
  onTickSeconds?: (secondsLeft: number) => void;
};

type VestingTimerProps = {
  completedProgress: number;
  remainingProgress: number;
  leftSec: number;
  totalSec: number;
};

export function RewardVestingTimer(props: RewardVestingTimerProps) {
  const { vestingStartDate, vestingEndDate, initProgress = 0, initialLeftSec = 0, onTickSeconds = noop } = props;

  const totalSec = useMemo(() => Math.max(0, vestingEndDate - vestingStartDate), [vestingStartDate, vestingEndDate]);

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
        onTickSeconds?.(secondsLeft);
      }}
      render={(secondsLeft = initialLeftSec) => {
        const elapsedSec = Math.max(0, totalSec - secondsLeft);

        const progress = clamp((elapsedSec / totalSec) * 100, 0, 100);
        const completedProgress = Math.max(progress, clamp(initProgress, 0, 100));
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

const VestingTimerLine = (props: VestingTimerProps) => {
  const { completedProgress, remainingProgress, leftSec, totalSec } = props;

  return (
    <div className='flex items-center gap-5'>
      <Text
        size='11'
        weight='500'
        lineHeight='16'
        className='text-color-24 shrink-0'
      >
        Vesting Duration
      </Text>
      <div className='flex w-full items-center gap-1'>
        <div
          className='bg-color-7 transition-width h-1 w-full rounded-xs'
          style={{ width: `${clamp(completedProgress, 0, 100)}%` }}
        />
        <Text
          size='11'
          weight='500'
          lineHeight='16'
          className='animate-vesting-text shrink-0 tabular-nums'
        >
          {FormatTime.cooldownFromSeconds(leftSec)}
        </Text>
        <div
          className='bg-color-9 transition-width h-1 w-full rounded-xs'
          style={{ width: `${clamp(remainingProgress, 0, 100)}%` }}
        />
        <Text
          size='11'
          weight='500'
          lineHeight='16'
          className='shrink-0 tabular-nums'
        >
          {FormatTime.cooldownFromSeconds(totalSec)}
        </Text>
      </div>
    </div>
  );
};
