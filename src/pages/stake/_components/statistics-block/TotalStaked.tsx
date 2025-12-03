import { formatUnits, splitNumberUnit } from '@/lib/utils/numbers';
import { useStatisticTotalStaked } from '@/pages/stake/_hooks/useStatisticTotalStaked';

const TotalStaked = () => {
  const { totalStaked } = useStatisticTotalStaked();

  const totalStakedFormatted = formatUnits(totalStaked);
  const [totalStakedValue, totalStakedUnit] = splitNumberUnit(totalStakedFormatted);

  return (
    <div className='statistics-block-item'>
      <p className='statistics-block-item__title'>Total staked</p>
      <div className='statistics-block-item__total-staked'>
        <img
          className='statistics-block-item__comp-image'
          alt='COMP icon'
          src='./images/comp.svg'
        />
        <p className='statistics-block-item__value'>
          {totalStakedValue}
          <span className='statistics-block-item__value-gray'>{totalStakedUnit}</span>
        </p>
      </div>
    </div>
  );
};

export { TotalStaked };
