import { useAccount } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { ClaimModal } from '@/components/common/stake/ClaimModal';
import { VestingModal } from '@/components/common/stake/VestingModal';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { RewardsTable } from '@/pages/stake/components/rewards-flow-block/RewardsTable';

export function RewardsFlowBlock() {
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
      >
        <div className='flex justify-between p-10'>
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
              className='max-w-32.5 text-[11px] font-medium'
            >
              Claim
            </Button>
          </div>
          <Divider orientation='vertical' />
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
            className='max-w-32.5 text-[11px] font-medium'
          >
            Vest
          </Button>
        </div>
        <Condition if={!isConnected}>
          <div className='p-10 flex'>
            <div className='mx-auto items-center w-auto flex flex-col gap-5'>
              <div className='w-44 h-20 no-position-yet' />
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
        </Condition>
        <Condition if={isConnected}>
          <RewardsTable />
        </Condition>
      </Card>
      <VestingModal
        isOpen={isVestingOpen}
        onClose={onVestingClose}
      />
      <ClaimModal
        isOpen={isClaimOpen}
        onClose={onClaimClose}
      />
    </>
  );
}
