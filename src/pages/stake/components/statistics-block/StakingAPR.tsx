import { useConnection } from 'wagmi';

import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';

export function StakingAPR() {
  const { isConnected } = useConnection();
  const { stakingAPR } = useStatisticStakingAPR();

  const { isLoading: isTotalStakedLoading } = useTotalStaked(APPLICATION_CHAIN);

  const isLoading = isConnected ? isTotalStakedLoading : false;

  return (
    <div className='flex w-1/2 justify-end'>
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
            size='40'
            weight='500'
          >
            {isConnected ? stakingAPR : '0.00'}
            <Text
              tag='span'
              size='40'
              weight='700'
              lineHeight='38'
              className='text-color-25'
            >
              %
            </Text>
          </Text>
        </Skeleton>
      </div>
    </div>
  );
}
