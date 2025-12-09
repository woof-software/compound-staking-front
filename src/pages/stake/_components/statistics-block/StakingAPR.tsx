import { Text } from '@/components/ui/Text';
import { Format } from '@/lib/utils/format';
import { splitNumberUnit } from '@/lib/utils/numbers';

import { useStatisticStakingAPR } from '../../_hooks/useStatisticStakingAPR';

export function StakingAPR() {
  const { stakingAPR } = useStatisticStakingAPR();

  const stakingAprFormatted = Format.rate(stakingAPR / 100);
  const [stakingAprValue, stakingAprUnit] = splitNumberUnit(stakingAprFormatted);

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
        className='text-color-2'
      >
        {stakingAprValue}
        <Text
          tag='span'
          size='40'
          weight='700'
          lineHeight='38'
          className='text-color-25'
        >
          {stakingAprUnit}
        </Text>
      </Text>
    </div>
  );
}
