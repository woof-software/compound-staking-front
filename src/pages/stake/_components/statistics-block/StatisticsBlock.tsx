import { Divider } from '@/components/ui/Divider';

import { StakingAPR } from './StakingAPR';
import { TotalStaked } from './TotalStaked';

export function StatisticsBlock() {
  return (
    <section className='flex justify-center items-start gap-[100px]'>
      <StakingAPR />
      <Divider
        orientation='vertical'
        thickness={1}
      />
      <TotalStaked />
    </section>
  );
}
