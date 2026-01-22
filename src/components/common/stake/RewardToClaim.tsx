import { formatUnits } from 'viem';

import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { Format } from '@/lib/utils/format';

export type RewardToClaimProps = {
  isLoading: boolean;
  baseTokenPriceValue: bigint;
  toClaimRaw: bigint;
};

export function RewardToClaim(props: RewardToClaimProps) {
  const { isLoading, baseTokenPriceValue, toClaimRaw } = props;

  const toClaimFormatted = formatUnits(toClaimRaw, ENV.BASE_TOKEN_DECIMALS);

  const toClaimPriceFormatted = formatUnits(
    toClaimRaw * baseTokenPriceValue,
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
          {Format.token(toClaimFormatted, 'compact')} COMP
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
}
