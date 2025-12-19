import { useConnection } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';

export function UnStakeFlowBlock() {
  const { isConnected } = useConnection();

  const isUnStakeButtonDisabled = !isConnected;

  return (
    <div className='flex flex-col gap-1.5'>
      <Card
        title='Unstake'
        tooltip='Cooldown period for unstaking process is 18d 00h 00m 00s'
      >
        <div className='flex items-start justify-between p-10'>
          <div className='flex gap-15'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Unstake
              </Text>
              <div className='flex flex-col gap-2'>
                <Skeleton loading={false}>
                  <Text
                    size='17'
                    weight='500'
                    lineHeight='17'
                    className={cn('text-color-2', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {isConnected ? '10.0000' : '0.0000'} COMP
                  </Text>
                </Skeleton>
                <Condition if={isConnected}>
                  <Skeleton loading={false}>
                    <Text
                      size='11'
                      className='text-color-24'
                    >
                      $400.00
                    </Text>
                  </Skeleton>
                </Condition>
              </div>
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
          </div>
          <Button
            disabled={isUnStakeButtonDisabled}
            className='max-w-32.5 text-[11px] font-medium'
          >
            Request unstake
          </Button>
        </div>
      </Card>
      <Condition if={isConnected}>
        <div className='bg-color-26 flex w-full items-center gap-2.5 rounded-lg p-2.5 pl-5'>
          <InfoIcon className='text-color-7 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-7'
          >
            Your funds are ready to be unstaked
          </Text>
        </div>
      </Condition>
    </div>
  );
}
