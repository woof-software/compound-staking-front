import { useConnection } from 'wagmi';

import { ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';

export function DelegateFlowBlock() {
  const { isConnected } = useConnection();

  const isDelegateButtonDisabled = !isConnected;

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
            <Skeleton loading={false}>
              <a
                className='flex items-start gap-1 cursor-pointer'
                target='_blank'
              >
                <Text
                  size='17'
                  weight='500'
                  lineHeight='17'
                  className={cn('text-color-2 max-w-36 truncate', {
                    'text-color-6': !isConnected
                  })}
                >
                  {isConnected ? 'Compound Foundation' : '-'}
                </Text>
                <Condition if={isConnected}>
                  <ExternalLinkIcon className='text-color-24' />
                </Condition>
              </a>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Cooldown
            </Text>
            <Skeleton loading={false}>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? '00d 00h' : '-'}
              </Text>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              End Date
            </Text>
            <Skeleton loading={false}>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? 'July 24, 2025' : '-'}
              </Text>
            </Skeleton>
          </div>
        </div>
        <Button
          disabled={isDelegateButtonDisabled}
          className='max-w-32.5 text-[11px] font-medium'
        >
          Delegate
        </Button>
      </div>
    </Card>
  );
}
