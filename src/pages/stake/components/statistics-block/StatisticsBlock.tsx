import { useConnection } from 'wagmi';

import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';

import { StakingAPR } from './StakingAPR';
import { TotalStaked } from './TotalStaked';

export function StatisticsBlock() {
  const { isConnected } = useConnection();

  const { isLoading: isTotalStakedLoading } = useTotalStaked(APPLICATION_CHAIN);

  const isLoading = isConnected ? isTotalStakedLoading : false;

  return (
    <>
      <div className='mx-auto max-w-164 p-2.5'>
        <Skeleton loading={isLoading}>
          <Text
            tag='h1'
            size='45'
            lineHeight='54'
            weight='500'
            align='center'
          >
            Stake your{' '}
            <Text
              tag='span'
              size='45'
              lineHeight='54'
              weight='500'
              className='text-color-7'
            >
              COMP
            </Text>{' '}
            tokens to earn yield every second!
          </Text>
        </Skeleton>
      </div>
      <section className='flex items-center justify-center gap-25'>
        <StakingAPR />
        <Divider orientation='vertical' />
        <TotalStaked />
      </section>
    </>
  );
}
