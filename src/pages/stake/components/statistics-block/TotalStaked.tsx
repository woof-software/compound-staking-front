import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { Format, FormatUnits } from '@/lib/utils/format';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';
import { useStatisticStore } from '@/stores/useStatisticStore';

import CompoundBlackCircle from '@/assets/svg/compound-black-circle.svg';

export function TotalStaked() {
  const { isConnected } = useConnection();

  const {
    data: totalStaked,
    isLoading: isTotalStakedLoading,
    refetch: refetchTotalStaked
  } = useTotalStaked(APPLICATION_CHAIN);

  const needTotalStakedRefresh = useStatisticStore(({ needRefresh }) => needRefresh);

  const isLoading = isConnected ? isTotalStakedLoading : false;

  const totalStakedFormat = formatUnits(totalStaked ?? 0n, ENV.BASE_TOKEN_DECIMALS);

  const totalStakedFormatted = Format.token(Number(totalStakedFormat), { fractionDigits: 2, view: 'compact' });

  const unit = FormatUnits.parse(Number(totalStakedFormat));

  const totalValue =
    unit && totalStakedFormatted.endsWith(unit) ? totalStakedFormatted.slice(0, -unit.length) : totalStakedFormatted;

  useEffect(() => {
    if (!isConnected || !needTotalStakedRefresh) return;
    refetchTotalStaked();
  }, [needTotalStakedRefresh, isConnected, refetchTotalStaked]);

  return (
    <div className='bg-card-border bg-statistics-bg relative flex w-full flex-col items-center gap-2.5 rounded-t-2xl px-4 py-7 md:w-1/2 md:items-start md:!bg-none md:p-0'>
      <Skeleton loading={isLoading}>
        <Text
          size='13'
          weight='500'
          className='text-color-24'
        >
          Total staked
        </Text>
      </Skeleton>
      <Skeleton loading={isLoading}>
        <div className='flex items-start gap-3'>
          <CompoundBlackCircle className='text-compound-icon-bg size-7.5 md:size-10' />
          <div className='inline-flex items-baseline gap-1'>
            <Text
              tag='span'
              weight='500'
              className='text-[32px] leading-none md:text-[40px]'
            >
              {totalValue}
            </Text>
            <Condition if={unit}>
              <Text
                tag='span'
                weight='700'
                className='text-color-25 text-[32px] leading-none md:text-[40px]'
              >
                {unit}
              </Text>
            </Condition>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}
