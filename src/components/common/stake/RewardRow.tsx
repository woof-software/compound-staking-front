import { formatUnits } from 'viem';

import { RewardToClaim } from '@/components/common/stake/RewardToClaim';
import { RewardVestingTimer } from '@/components/common/stake/RewardVestingTimer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Format, FormatTime } from '@/lib/utils/format';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

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

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const vestingAmountPriceFormatted = formatUnits(
    vestingAmount * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  return (
    <div className='even:bg-color-5 flex flex-col gap-5 rounded-sm px-5 py-5 md:px-10 md:py-10 lg:px-8 lg:py-12'>
      <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-5'>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              weight='500'
              className='text-color-24 mb-5 block lg:hidden'
            >
              Vesting amount
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <div className='flex items-center gap-1.5'>
              <CompoundBlackCircle className='text-compound-icon-bg block size-3.5 lg:hidden' />
              <Text
                size='15'
                lineHeight='20'
                className='tabular-nums'
              >
                {Format.token(formatUnits(vestingAmount, ENV.BASE_TOKEN_DECIMALS), {
                  symbol: isDesktop ? 'COMP' : undefined
                })}
              </Text>
            </div>
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
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              weight='500'
              className='text-color-24 mb-5 block lg:hidden'
            >
              Start Date
            </Text>
          </Skeleton>
          <Text
            size='15'
            lineHeight='20'
          >
            {FormatTime.endDate(startDate)}
          </Text>
        </div>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              weight='500'
              className='text-color-24 mb-5 block lg:hidden'
            >
              End Date
            </Text>
          </Skeleton>
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
              size='11'
              weight='500'
              className='text-color-24 mb-5 block lg:hidden'
            >
              Claimed Amount
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <div className='flex items-center gap-1.5'>
              <CompoundBlackCircle className='text-compound-icon-bg block size-3.5 lg:hidden' />
              <Text
                size='15'
                lineHeight='20'
                className='tabular-nums'
              >
                {Format.token(formatUnits(claimedAmount, ENV.BASE_TOKEN_DECIMALS), {
                  symbol: isDesktop ? 'COMP' : undefined
                })}
              </Text>
            </div>
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
