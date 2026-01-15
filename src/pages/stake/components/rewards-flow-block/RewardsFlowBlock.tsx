import { useMemo } from 'react';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { ClaimModal } from '@/components/common/stake/ClaimModal';
import { VestingModal } from '@/components/common/stake/VestingModal';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';
import { rewardsDto } from '@/lib/dto/rewards';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { RewardsTable } from '@/pages/stake/components/rewards-flow-block/RewardsTable';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';

export function RewardsFlowBlock() {
  const { isConnected, address } = useConnection();

  const { isEnabled: isVestingOpen, enable: onVestingOpen, disable: onVestingClose } = useSwitch();
  const { isEnabled: isClaimOpen, enable: onClaimOpen, disable: onClaimClose } = useSwitch();

  const { data: vestingPositions, isLoading: isVestingLoading } = useVestingPosition(address);

  const isLoading = isConnected ? isVestingLoading : false;

  const rows = useMemo(() => rewardsDto(vestingPositions), [vestingPositions]);

  const availableRewards = useMemo(() => rows.reduce((acc, r) => acc + r.toClaim, 0), [rows]);

  const totalToClaim = useMemo(() => rows.reduce((acc, r) => acc + (r.vestingAmount - r.claimedAmount), 0), [rows]);

  const isClaimButtonDisabled = !isConnected || isLoading;
  const isVestButtonDisabled = !isConnected || isLoading;

  console.log('vestingPositions=>', vestingPositions);

  return (
    <>
      <Card
        isLoading={isLoading}
        title='Rewards'
        tooltip='Stake your COMP tokens to earn yield every second!'
      >
        <div className='border-color-8 flex justify-between border-b-1 p-10'>
          <div className='flex w-full max-w-120 justify-between'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                weight='500'
                className='text-color-24'
              >
                Available Rewards
              </Text>
              <Skeleton loading={isLoading}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {(isConnected ?? !!availableRewards) ? Format.token(availableRewards, 'compact') : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                weight='500'
                className='text-color-24'
              >
                Total to claim
              </Text>
              <Skeleton loading={isLoading}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {(isConnected ?? !!totalToClaim) ? Format.token(totalToClaim, 'compact') : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <Button
              disabled={isLoading}
              onClick={onClaimOpen}
              className='max-w-32.5 text-[11px] font-medium'
            >
              <Skeleton
                loading={isLoading}
                className='w-full'
              >
                <Text
                  tag='p'
                  size='11'
                  weight='500'
                  align='center'
                  className={cn('text-color-6', {
                    'text-white': !isClaimButtonDisabled
                  })}
                >
                  Claim
                </Text>
              </Skeleton>
            </Button>
          </div>
          <Divider orientation='vertical' />
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              weight='500'
              className='text-color-24'
            >
              Available Rewards
            </Text>
            <div className='flex flex-col gap-2'>
              <Skeleton loading={isLoading}>
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
                <Skeleton loading={isLoading}>
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
            disabled={isVestButtonDisabled}
            onClick={onVestingOpen}
            className='max-w-32.5 text-[11px] font-medium'
          >
            <Skeleton
              loading={isLoading}
              className='w-full'
            >
              <Text
                tag='p'
                size='11'
                weight='500'
                align='center'
                className={cn('text-color-6', {
                  'text-white': !isVestButtonDisabled
                })}
              >
                Vest
              </Text>
            </Skeleton>
          </Button>
        </div>
        <Condition if={!isConnected && !rows.length}>
          <div className='flex p-10'>
            <div className='mx-auto flex w-auto flex-col items-center gap-5'>
              <div className='no-position-yet h-20 w-44' />
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
        <Condition if={isConnected && !!rows.length}>
          <RewardsTable rows={rows} />
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
