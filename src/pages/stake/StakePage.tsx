import { DelegateFlowBlock } from '@/pages/stake/components/delegate-flow-block/DelegateFlowBlock';
import { RewardsFlowBlock } from '@/pages/stake/components/rewards-flow-block/RewardsFlowBlock';
import { StakeFlowBlock } from '@/pages/stake/components/stake-flow-block/StakeFlowBlock';
import { StatisticsBlock } from '@/pages/stake/components/statistics-block/StatisticsBlock';
import { UnstakeFlowBlock } from '@/pages/stake/components/unstake-flow-block/UnstakeFlowBlock';

export function StakePage() {
  return (
    <main className='mx-2 flex flex-1 flex-col gap-10 pt-10 pb-15 md:mx-0'>
      <StatisticsBlock />
      <div className='flex flex-col gap-2.5 lg:gap-5'>
        <StakeFlowBlock />
        <UnstakeFlowBlock />
        <DelegateFlowBlock />
        <RewardsFlowBlock />
      </div>
    </main>
  );
}
