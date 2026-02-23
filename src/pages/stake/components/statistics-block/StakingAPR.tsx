import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { Format } from '@/lib/utils/format';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';

export function StakingAPR() {
  const { isConnected, chainId } = useConnection();

  const { data: stakingApr = 0n } = useStatisticStakingAPR(chainId);

  const { isLoading: isTotalStakedLoading } = useTotalStaked(APPLICATION_CHAIN);

  const isLoading = isConnected ? isTotalStakedLoading : false;

  const stakingAprFormatted = Format.rate(+formatUnits(stakingApr, ENV.BASE_APR_DECIMALS));

  return (
    <div className='bg-card-border bg-statistics-bg relative flex w-full justify-center rounded-t-2xl px-4 py-7 md:w-1/2 md:justify-end md:!bg-none md:p-0'>
      <div className='flex flex-col items-start gap-1.5'>
        <Skeleton loading={isLoading}>
          <Text
            size='13'
            weight='500'
            className='text-color-24'
          >
            Staking APR up to
          </Text>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <Text
            weight='500'
            className='text-[32px] md:text-[40px]'
          >
            {isConnected ? stakingAprFormatted : '0.00'}
            <Text
              tag='span'
              weight='700'
              lineHeight='38'
              className='text-color-25 text-[32px] md:text-[40px]'
            >
              %
            </Text>
          </Text>
        </Skeleton>
      </div>
    </div>
  );
}
