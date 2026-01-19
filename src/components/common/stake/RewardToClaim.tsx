import { memo, useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useNowTime } from '@/hooks/useNowTime';
import { Format } from '@/lib/utils/format';
import { getNowSecSnapshot } from '@/lib/utils/time';
import { useToClaimLiveStore } from '@/stores/useToClaimStore';

export type RewardToClaimProps = {
  rowKey: string;
  isLoading: boolean;
  baseTokenPriceValue: bigint;
  vesting: bigint;
  claimed: bigint;
  vestingStartDate: number;
  vestingEndDate: number;
};

export const RewardToClaim = memo(function RewardToClaim(props: RewardToClaimProps) {
  const { rowKey, isLoading, baseTokenPriceValue, vesting, claimed, vestingStartDate, vestingEndDate } = props;

  const snapshotNow = getNowSecSnapshot();
  const shouldTick = vestingEndDate > snapshotNow;

  const nowSec = useNowTime(shouldTick);

  const setRow = useToClaimLiveStore((s) => s.setRow);
  const removeRow = useToClaimLiveStore((s) => s.removeRow);

  const { toClaim, toClaimFormatted, toClaimPriceFormatted } = useMemo(() => {
    const totalSecNum = Math.max(0, vestingEndDate - vestingStartDate);

    let vested: bigint;

    if (totalSecNum <= 0) {
      vested = vesting;
    } else if (nowSec <= vestingStartDate) {
      vested = 0n;
    } else if (nowSec >= vestingEndDate) {
      vested = vesting;
    } else {
      const elapsed = BigInt(Math.max(0, nowSec - vestingStartDate));
      const total = BigInt(totalSecNum);
      vested = (vesting * elapsed) / total;
    }

    const toClaim = vested > claimed ? vested - claimed : 0n;

    const toClaimFormatted = formatUnits(toClaim, ENV.STAKED_TOKEN_DECIMALS);
    const toClaimPriceFormatted = formatUnits(
      toClaim * baseTokenPriceValue,
      ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
    );

    return { toClaim, toClaimFormatted, toClaimPriceFormatted };
  }, [vesting, claimed, vestingStartDate, vestingEndDate, nowSec, baseTokenPriceValue]);

  useEffect(() => {
    setRow(rowKey, toClaim);

    return () => removeRow(rowKey);
  }, [rowKey, toClaim]);

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
});
