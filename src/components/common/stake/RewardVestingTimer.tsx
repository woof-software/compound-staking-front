import { memo, useMemo } from 'react';

import type { RewardRowProps } from '@/components/common/stake/RewardRow';
import { Text } from '@/components/ui/Text';
import { useNowTime } from '@/hooks/useNowTime';
import { FormatTime } from '@/lib/utils/format';
import { clamp } from '@/lib/utils/numeric';
import { getNowSecSnapshot } from '@/lib/utils/time';

export type RewardVestingTimerProps = Pick<RewardRowProps, 'vestingStartDate' | 'vestingEndDate' | 'percents'>;

export const RewardVestingTimer = memo(function RewardVestingTimer(props: RewardVestingTimerProps) {
  const { percents: percentsFromProps, vestingStartDate, vestingEndDate } = props;

  const snapshotNow = getNowSecSnapshot();
  const shouldTick = vestingEndDate > snapshotNow;

  const nowSec = useNowTime(shouldTick);

  const { totalSec, leftSec, progressPct, percents } = useMemo(() => {
    const totalSec = Math.max(0, vestingEndDate - vestingStartDate);
    const leftSec = Math.max(0, vestingEndDate - nowSec);

    if (totalSec <= 0) {
      const p = clamp(percentsFromProps ?? 0, 0, 100);
      return { totalSec: 0, leftSec: 0, progressPct: p, percents: 100 - p };
    }

    const elapsedSec = Math.max(0, Math.min(totalSec, nowSec - vestingStartDate));
    const progressPct = clamp((elapsedSec / totalSec) * 100, 0, 100);
    const percents = 100 - progressPct;

    return { totalSec, leftSec, progressPct, percents };
  }, [vestingStartDate, vestingEndDate, nowSec, percentsFromProps]);

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
          style={{ width: `${clamp(progressPct, 0, 100)}%` }}
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
          style={{ width: `${clamp(percents, 0, 100)}%` }}
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
});
