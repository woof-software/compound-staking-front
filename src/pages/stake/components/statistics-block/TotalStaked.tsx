import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { Format, FormatUnits } from '@/lib/utils/format';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';
import { useStatisticStore } from '@/stores/useStatisticStore';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export function TotalStaked() {
  const { isConnected, chainId } = useConnection();

  const { data: totalStaked, isLoading: isTotalStakedLoading, refetch: refetchTotalStaked } = useTotalStaked(chainId);

  const needTotalStakedRefresh = useStatisticStore(({ needRefresh }) => needRefresh);

  const totalStakedFormatted = formatUnits(totalStaked ?? 0n, ENV.BASE_TOKEN_DECIMALS);

  const unit = FormatUnits.parse(Number(totalStakedFormatted));

  const isLoading = isConnected ? isTotalStakedLoading : false;

  useEffect(() => {
    if (!isConnected || !needTotalStakedRefresh) return;

    refetchTotalStaked();
  }, [needTotalStakedRefresh, isConnected]);

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <Text
        size='13'
        weight='500'
        className='text-color-24'
      >
        Total staked
      </Text>
      <Skeleton loading={isLoading}>
        <div className='flex items-start gap-3'>
          <CompoundBlackCircle className='text-compound-icon-bg size-10' />
          <Text
            size='40'
            weight='500'
          >
            {Format.token(totalStakedFormatted, 'compact', undefined, 2).slice(0, -1)}
            <Condition if={isConnected && !!unit}>
              <Text
                tag='span'
                size='40'
                weight='700'
                lineHeight='38'
                className='text-color-25'
              >
                {unit}
              </Text>
            </Condition>
          </Text>
        </div>
      </Skeleton>
    </div>
  );
}
