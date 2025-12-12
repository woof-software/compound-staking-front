import { ExternalLinkIcon } from '@/assets/svg';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { sliceAddress } from '@/lib/utils/common';

export function DelegateFlowBlock() {
  return (
    <Card
      title='Delegation'
      tooltip='Cooldown period for redelegation process is 01d 00h 00m 00s'
    >
      <div className='flex justify-between p-10'>
        <div className='flex gap-15'>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Wallet address of Delegatee
            </Text>
            <a
              className='flex items-start gap-1 cursor-pointer'
              target='_blank'
            >
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className='text-color-2'
              >
                {sliceAddress('0x09fd7d573a4318f1dd34cab8000928d7270ce8e7')}
              </Text>
              <ExternalLinkIcon className='text-color-24' />
            </a>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Cooldown
            </Text>
            <Text
              size='17'
              weight='500'
              lineHeight='17'
              className='text-color-2'
            >
              00d 00h
            </Text>
          </div>
        </div>
        <Button className='max-w-32.5 text-11 font-medium'>Delegate</Button>
      </div>
    </Card>
  );
}
