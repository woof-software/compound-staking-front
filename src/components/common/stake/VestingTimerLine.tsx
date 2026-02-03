import { Condition } from '@/components/common/Condition';
import { Text } from '@/components/ui/Text';
import { FormatTime } from '@/lib/utils/format';
import { clamp } from '@/lib/utils/numeric';

export type VestingTimerProps = {
  completedProgress: number;
  remainingProgress: number;
  leftSec: number;
  totalSec: number;
};

export function VestingTimerLine(props: VestingTimerProps) {
  const { completedProgress, remainingProgress, leftSec, totalSec } = props;

  return (
    <div className='flex items-center gap-5'>
      <Text
        size='11'
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
        <Condition if={leftSec}>
          <Text
            size='11'
            lineHeight='16'
            className='animate-vesting-text shrink-0 tabular-nums'
          >
            {FormatTime.cooldownFromSeconds(leftSec)}
          </Text>
        </Condition>
        <div
          className='bg-color-9 transition-width h-1 w-full rounded-xs'
          style={{ width: `${clamp(remainingProgress, 0, 100)}%` }}
        />
        <Text
          size='11'
          lineHeight='16'
          className='shrink-0 tabular-nums'
        >
          {FormatTime.cooldownFromSeconds(totalSec)}
        </Text>
      </div>
    </div>
  );
}
