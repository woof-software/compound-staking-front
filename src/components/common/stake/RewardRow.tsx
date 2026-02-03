import { formatUnits } from 'viem';

import { RewardToClaim } from '@/components/common/stake/RewardToClaim';
import { RewardVestingTimer } from '@/components/common/stake/RewardVestingTimer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { Format, FormatTime } from '@/lib/utils/format';

export interface RewardRowProps {
  baseTokenPriceValue: bigint;
  isLoading: boolean;
  vestingAmount: bigint;
  toClaim: bigint;
  claimedAmount: bigint;
  startDate: number;
  endDate: number;
}

export function RewardRow(props: RewardRowProps) {
  const { baseTokenPriceValue, isLoading, vestingAmount, claimedAmount, startDate, endDate } = props;

  const vestingAmountPriceFormatted = formatUnits(
    vestingAmount * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  return (
    <div className='even:bg-color-5 flex flex-col gap-5 rounded-sm px-8 py-12'>
      <div className='grid grid-cols-5'>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='15'
              lineHeight='20'
              className='tabular-nums'
            >
              {Format.token(formatUnits(vestingAmount, ENV.BASE_TOKEN_DECIMALS), 'compact', 'COMP')}
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24 tabular-nums'
            >
              {Format.price(vestingAmountPriceFormatted, 'standard')}
            </Text>
          </Skeleton>
        </div>
        <RewardToClaim
          isLoading={isLoading}
          baseTokenPriceValue={baseTokenPriceValue}
          vesting={vestingAmount}
          claimed={claimedAmount}
          vestingStartDate={startDate}
          vestingEndDate={endDate}
        />
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
          <Skeleton loading={isLoading}>
            <Text
              size='15'
              lineHeight='20'
              className='tabular-nums'
            >
              {Format.token(formatUnits(claimedAmount, ENV.BASE_TOKEN_DECIMALS), 'compact', 'COMP')}
            </Text>
          </Skeleton>
        </div>
      </div>
      <RewardVestingTimer
        vestingStartDate={startDate}
        vestingEndDate={endDate}
      />
    </div>
  );
}
