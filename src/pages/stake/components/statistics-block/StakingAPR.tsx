import { useAccount } from 'wagmi';

import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';

export function StakingAPR() {
  const { isConnected } = useAccount();
  const { stakingAPR } = useStatisticStakingAPR();

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <Text
        size='13'
        weight='500'
        className='text-color-24'
      >
        Staking APR up to
      </Text>
      <Skeleton loading={false}>
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
  );
}
