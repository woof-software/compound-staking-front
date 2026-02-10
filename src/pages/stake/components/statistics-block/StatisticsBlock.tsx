import { useConnection } from 'wagmi';

import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
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
          <h1 className='text-center text-[32px] leading-[120%] font-medium md:text-[45px] md:leading-13.5'>
            Stake your{' '}
            <span className='text-color-7 text-[32px] leading-[120%] font-medium md:text-[45px] md:leading-13.5'>
              COMP
            </span>{' '}
            tokens to earn yield every second!
          </h1>
        </Skeleton>
      </div>
      <section className='flex flex-col items-center justify-center md:flex-row md:gap-25'>
        <StakingAPR />
        <Divider
          orientation='vertical'
          className='hidden md:block'
        />
        <TotalStaked />
      </section>
    </>
  );
}
