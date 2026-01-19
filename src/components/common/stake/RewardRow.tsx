import { memo, useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { RewardVestingTimer } from '@/components/common/stake/RewardVestingTimer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import type { RewardDtoRet } from '@/lib/dto/rewards';
import { Format, FormatTime } from '@/lib/utils/format';

import { RewardToClaim } from './RewardToClaim';

export interface RewardRowProps extends RewardDtoRet {
  baseTokenPriceValue: bigint;
  isLoading: boolean;
}

export const RewardRow = memo(function RewardRow(props: RewardRowProps) {
  const {
    baseTokenPriceValue,
    isLoading,
    vestingAmount,
    startDate,
    endDate,
    claimedAmount,
    vestingStartDate,
    vestingEndDate,
    percents
  } = props;

  const rowKey = `${vestingStartDate}-${vestingEndDate}`;

  const { vesting, claimed, vestingAmountPriceFormatted } = useMemo(() => {
    const vesting = parseUnits(vestingAmount.toString(), ENV.STAKED_TOKEN_DECIMALS);
    const claimed = parseUnits(claimedAmount.toString(), ENV.STAKED_TOKEN_DECIMALS);

    return {
      vesting,
      claimed,
      vestingAmountPriceFormatted: formatUnits(
        vesting * baseTokenPriceValue,
        ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
      )
    };
  }, [vestingAmount, claimedAmount, baseTokenPriceValue]);

  return (
    <div className='even:bg-color-5 flex flex-col gap-5 rounded-sm px-8 py-6'>
      <div className='grid grid-cols-5'>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='15'
              lineHeight='20'
            >
              {Format.token(vestingAmount, 'compact')} COMP
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {Format.price(vestingAmountPriceFormatted, 'standard')}
            </Text>
          </Skeleton>
        </div>
        <RewardToClaim
          rowKey={rowKey}
          isLoading={isLoading}
          baseTokenPriceValue={baseTokenPriceValue}
          vesting={vesting}
          claimed={claimed}
          vestingStartDate={vestingStartDate}
          vestingEndDate={vestingEndDate}
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
          <Text
            size='15'
            lineHeight='20'
          >
            {Format.token(claimedAmount, 'compact')} COMP
          </Text>
        </div>
      </div>
      <RewardVestingTimer
        percents={percents}
        vestingEndDate={vestingEndDate}
        vestingStartDate={vestingStartDate}
      />
    </div>
  );
});
