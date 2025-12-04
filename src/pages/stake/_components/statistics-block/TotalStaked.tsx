import { Text } from '@/components/ui/Text';
import { formatUnits, splitNumberUnit } from '@/lib/utils/numbers';
import { useStatisticTotalStaked } from '@/pages/stake/_hooks/useStatisticTotalStaked';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export function TotalStaked() {
  const { totalStaked } = useStatisticTotalStaked();

  const totalStakedFormatted = formatUnits(totalStaked);
  const [totalStakedValue, totalStakedUnit] = splitNumberUnit(totalStakedFormatted);

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <Text
        size='13'
        weight='500'
        className='text-color-24'
      >
        Total staked
      </Text>
      <div className='flex items-start gap-3'>
        <CompoundBlackCircle className='mt-1 size-10' />
        <Text
          size='40'
          weight='500'
          className='text-color-2'
        >
          {totalStakedValue}
          <Text
            tag='span'
            size='40'
            weight='700'
            lineHeight='38'
            className='text-color-25'
          >
            {totalStakedUnit}
          </Text>
        </Text>
      </div>
    </div>
  );
}
