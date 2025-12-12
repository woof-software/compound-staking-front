import { useAccount } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { Format, FormatUnits } from '@/lib/utils/format';
import { useStatisticTotalStaked } from '@/pages/stake/_hooks/useStatisticTotalStaked';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export function TotalStaked() {
  const { isConnected } = useAccount();
  const { totalStaked } = useStatisticTotalStaked();

  const totalStakedFormatted = parseFloat(Format.token(Number(totalStaked), 'compact'));
  const unit = FormatUnits.parse(Number(totalStaked));

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <Text
        size='13'
        weight='500'
        className='text-color-24'
      >
        Total staked
      </Text>
      <Skeleton loading={false}>
        <div className='flex items-start gap-3'>
          <CompoundBlackCircle className='mt-1 size-10 text-compound-icon-bg' />
          <Text
            size='40'
            weight='500'
          >
            {isConnected ? totalStakedFormatted : '0.00'}
            <Condition if={isConnected}>
              <Text
                tag='span'
                size='40'
                weight='700'
                lineHeight='38'
                className='text-color-25'
              >
                {unit}
              </Text>
            </Condition>
          </Text>
        </div>
      </Skeleton>
    </div>
  );
}
