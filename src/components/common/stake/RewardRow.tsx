import dayjs from 'dayjs';

import { Text } from '@/components/ui/Text';
import type { RewardRowProps } from '@/lib/dto/rewards';
import { Format, FormatTime } from '@/lib/utils/format';
import { clamp } from '@/lib/utils/numeric';

export function RewardRow(props: RewardRowProps) {
  const { vestingAmount, toClaim, startDate, endDate, claimedAmount, vestingStartDate, vestingEndDate, percents } =
    props;

  const vestingDuration = 100 - percents;

  const now = dayjs().unix();
  const totalSec = Math.max(0, vestingEndDate - vestingStartDate);
  const leftSec = Math.max(0, vestingEndDate - now);

  const leftLabel = FormatTime.cooldownFromSeconds(leftSec);
  const totalLabel = FormatTime.cooldownFromSeconds(totalSec);

  return (
    <div className='even:bg-color-5 flex flex-col gap-5 rounded-sm px-8 py-6'>
      <div className='grid grid-cols-5'>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {Format.token(vestingAmount, 'compact')} COMP
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            $40.00
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {Format.token(toClaim, 'compact')} COMP
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            $40.00
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {FormatTime.endDate(startDate)}
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {FormatTime.endDate(endDate)}
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {Format.token(claimedAmount, 'compact')} COMP
          </Text>
        </div>
      </div>
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
            style={{ width: `${clamp(percents, 0, 100)}%` }}
          />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='animate-vesting-text shrink-0'
          >
            {leftLabel}
          </Text>
          <div
            className='bg-color-9 transition-width h-1 w-full rounded-xs'
            style={{ width: `${clamp(vestingDuration, 0, 100)}%` }}
          />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='shrink-0'
          >
            {totalLabel}
          </Text>
        </div>
      </div>
    </div>
  );
}
