import { Text } from '@/components/ui/Text';
import { clamp } from '@/lib/utils/numeric';

export type RewardRowProps = {
  id: number;
  vestingAmount: string;
  toClaim: string;
  startDate: string;
  endDate: string;
  claimedAmount: string;
  vestingStartDate: string;
  vestingEndDate: string;
  percents: number;
};

export function RewardRow(props: RewardRowProps) {
  const { vestingAmount, toClaim, startDate, endDate, claimedAmount, percents } = props;

  const vestingDuration = 100 - percents;

  return (
    <div className='py-6 flex flex-col gap-5 px-8 even:bg-color-5 rounded-sm'>
      <div className='grid grid-cols-5'>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {vestingAmount} COMP
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
            {toClaim} COMP
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {startDate}
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {endDate}
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {claimedAmount}
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
        <div className='flex items-center gap-1 w-full'>
          <div
            className='bg-color-7 w-full h-1 rounded-xs transition-width'
            style={{ width: `${clamp(percents, 0, 100)}%` }}
          />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='shrink-0 animate-vesting-text'
          >
            6d 23h
          </Text>
          <div
            className='bg-color-9 w-full h-1 rounded-xs transition-width'
            style={{ width: `${clamp(vestingDuration, 0, 100)}%` }}
          />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='shrink-0'
          >
            18d 23h
          </Text>
        </div>
      </div>
    </div>
  );
}
