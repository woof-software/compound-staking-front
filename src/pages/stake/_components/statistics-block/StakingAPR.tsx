import { Text } from '@/components/ui/Text';

import { useStatisticStakingAPR } from '../../_hooks/useStatisticStakingAPR';

export function StakingAPR() {
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
      <Text
        size='40'
        weight='500'
      >
        {stakingAPR}
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
    </div>
  );
}
