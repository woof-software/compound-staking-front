import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export function StakeFlowBlock() {
  return (
    <Card
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <div className='justify-between flex p-10'>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            className='text-color-24'
          >
            Staked
          </Text>
          <Text
            size='17'
            weight='500'
            className='text-color-2'
          >
            0.0000 COMP
          </Text>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            stCOMP balance
          </Text>
          <Text
            size='17'
            weight='500'
            className='text-color-2'
          >
            0.0000 COMP
          </Text>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            Multiplier
          </Text>
          <Text
            size='17'
            weight='500'
            className='text-color-2'
          >
            1x
          </Text>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            Available Rewards
          </Text>
          <Text
            size='17'
            weight='500'
            className='text-color-2'
          >
            0.0000 COMP
          </Text>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            APR
          </Text>
          <Text
            size='17'
            weight='500'
            className='text-color-2'
          >
            0.00%
          </Text>
        </div>
        <Button className='max-w-32.5 text-11 font-medium'>Stake</Button>
      </div>
    </Card>
  );
}
