import { lazy } from 'react';
import { useAccount } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';
import { useThemeStore } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/cn';

import NoPositionYet from '@/assets/no-position-yet.svg';
import NoPositionYetLight from '@/assets/no-position-yet-light.svg';

const LazyVestingModal = lazy(() => import('@/components/common/stake/VestingModal'));
const LazyClaimModal = lazy(() => import('@/components/common/stake/ClaimModal'));

export function RewardsFlowBlock() {
  const { theme } = useThemeStore();
  const { isConnected } = useAccount();

  const { isEnabled: isVestingOpen, enable: onVestingOpen, disable: onVestingClose } = useSwitch();
  const { isEnabled: isClaimOpen, enable: onClaimOpen, disable: onClaimClose } = useSwitch();

  const isClaimButtonDisabled = !isConnected;
  const isVestingButtonDisabled = !isConnected;

  return (
    <>
      <Card
        title='Stake'
        tooltip='Stake your COMP tokens to earn yield every second!'
        classNames={{
          content: 'px-0'
        }}
      >
        <div className='border-b flex justify-between border-color-8 px-10 pb-5'>
          <div className='flex w-full justify-between max-w-120'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Available Rewards
              </Text>
              <Skeleton loading={false}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {isConnected ? '0.0000' : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Total to claim
              </Text>
              <Skeleton loading={false}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {isConnected ? '0.0000' : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <Button
              disabled={isClaimButtonDisabled}
              onClick={onClaimOpen}
              className='max-w-[130px] text-11 font-medium'
            >
              Claim
            </Button>
          </div>
          <Divider
            orientation='vertical'
            className='max-h-10 !min-h-10 mx-12'
          />
          <div className='flex w-full justify-between max-w-75'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Available Rewards
              </Text>
              <div className='flex flex-col gap-2'>
                <Skeleton loading={false}>
                  <Text
                    size='17'
                    weight='500'
                    className={cn('text-color-2', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {isConnected ? '0.0000' : '0.0000'} COMP
                  </Text>
                </Skeleton>
                <Condition if={isConnected}>
                  <Skeleton loading={false}>
                    <Text
                      size='11'
                      className='text-color-24'
                    >
                      $40.00
                    </Text>
                  </Skeleton>
                </Condition>
              </div>
            </div>
            <Button
              disabled={isVestingButtonDisabled}
              onClick={onVestingOpen}
              className='max-w-[130px] text-11 font-medium'
            >
              Vest
            </Button>
          </div>
        </div>
        <div className='p-10 flex'>
          <div className='mx-auto items-center w-auto flex flex-col gap-5'>
            <Condition if={theme === 'dark'}>
              <NoPositionYet className='w-[176px] h-20' />
            </Condition>
            <Condition if={theme === 'light'}>
              <NoPositionYetLight className='w-[176px] h-20' />
            </Condition>
            <Text
              size='15'
              weight='500'
              lineHeight='16'
            >
              No Positions Yet
            </Text>
            <Text
              size='15'
              weight='500'
              lineHeight='21'
              className='text-color-24'
            >
              No vested rewards yet
            </Text>
          </div>
        </div>
      </Card>
      <LazyVestingModal
        isOpen={isVestingOpen}
        onClose={onVestingClose}
      />
      <LazyClaimModal
        isOpen={isClaimOpen}
        onClose={onClaimClose}
      />
    </>
  );
}
