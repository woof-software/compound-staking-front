import { Text } from '@/components/ui/Text';

import { DelegateFlowBlock } from './_components/delegate-flow-block/DelegateFlowBlock';
import { StakeFlowBlock } from './_components/stake-flow-block/StakeFlowBlock';
import { StatisticsBlock } from './_components/statistics-block/StatisticsBlock';
import { UnStakeFlowBlock } from './_components/unstake-flow-block/UnStakeFlowBlock';

export function StakePage() {
  return (
    <main className='pt-10 pb-15 flex-1 flex flex-col gap-10'>
      <Text
        tag='h1'
        size='45'
        lineHeight='54'
        weight='500'
        align='center'
        className='p-2.5 text-color-2 max-w-[653px] mx-auto'
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
      <StatisticsBlock />
      <StakeFlowBlock />
      <UnStakeFlowBlock />
      <DelegateFlowBlock />
    </main>
  );
}
