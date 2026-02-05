import { formatUnits } from 'viem';

import { Duration } from '@/components/common/Duration';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { vestingToClaimCalc } from '@/lib/rewards';
import { Format } from '@/lib/utils/format';

export type RewardToClaimProps = {
  isLoading: boolean;
  baseTokenPriceValue: bigint;
  vesting: bigint;
  claimed: bigint;
  vestingStartDate: number;
  vestingEndDate: number;
};

export function RewardToClaim(props: RewardToClaimProps) {
  const { isLoading, baseTokenPriceValue, vesting, claimed, vestingStartDate, vestingEndDate } = props;

  return (
    <Duration
      end={vestingEndDate * 1000}
      unsafeRound={(msLeft) => Math.max(Math.ceil(msLeft / 1000), 0)}
      render={(secondsLeft = 0) => {
        const toClaim = vestingToClaimCalc({
          vestingAmount: vesting,
          claimedAmount: claimed,
          endDate: vestingEndDate,
          startDate: vestingStartDate,
          secondsLeft
        });

        const toClaimFormatted = formatUnits(toClaim, ENV.STAKED_TOKEN_DECIMALS);

        const toClaimPriceFormatted = formatUnits(
          toClaim * baseTokenPriceValue,
          ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
        );

        return (
          <div>
            <Skeleton loading={isLoading}>
              <Text
                size='15'
                lineHeight='20'
                className='tabular-nums'
              >
                {Format.token(toClaimFormatted, { symbol: 'COMP' })}
              </Text>
            </Skeleton>
            <Skeleton loading={isLoading}>
              <Text
                size='11'
                lineHeight='16'
                className='text-color-24 tabular-nums'
              >
                {Format.price(toClaimPriceFormatted, 'standard')}
              </Text>
            </Skeleton>
          </div>
        );
      }}
    />
  );
}
