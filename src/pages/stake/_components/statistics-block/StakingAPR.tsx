import { formatRate, splitNumberUnit } from '@/lib/utils/numbers';

import { useStatisticStakingAPR } from '../../_hooks/useStatisticStakingAPR';

const StakingAPR = () => {
  const { stakingAPR } = useStatisticStakingAPR();

  const stakingAprFormatted = formatRate(stakingAPR / 100);
  const [stakingAprValue, stakingAprUnit] = splitNumberUnit(stakingAprFormatted);

  return (
    <div className='statistics-block-item'>
      <p className='statistics-block-item__title'>Staking APR up to</p>
      <p className='statistics-block-item__value'>
        {stakingAprValue}
        <span className='statistics-block-item__value-gray'>{stakingAprUnit}</span>
      </p>
    </div>
  );
};

export { StakingAPR };
