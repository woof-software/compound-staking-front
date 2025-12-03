import { formatUnitsCompact, formatValueInDollars, splitNumberUnit } from '@/lib/utils/numbers';

import { useStatisticRewardsBudget } from '../../_hooks/useStatisticRewardsBudget';

const RewardsBudget = () => {
  const { rewardsBudget, rewardsBudgetCOMP } = useStatisticRewardsBudget();

  const rewardsBudgetFormatted = formatValueInDollars(0, BigInt(rewardsBudget));
  const [rewardsBudgetValue, rewardsBudgetUnit] = splitNumberUnit(rewardsBudgetFormatted);

  const rewardsBudgetCompFormatted = formatUnitsCompact(rewardsBudgetCOMP);
  const [rewardsBudgetCompValue, rewardsBudgetCompUnit] = splitNumberUnit(rewardsBudgetCompFormatted);

  return (
    <div className='statistics-block-item'>
      <p className='statistics-block-item__title'>Rewards budget</p>
      <p className='statistics-block-item__value'>
        {rewardsBudgetValue}
        <span className='statistics-block-item__value-gray'>{rewardsBudgetUnit}</span>
      </p>
      <p className='statistics-block-item__text'>
        {rewardsBudgetCompValue}
        {rewardsBudgetCompUnit} COMP
      </p>
    </div>
  );
};

export { RewardsBudget };
