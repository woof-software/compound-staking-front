import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import { useStakeTransaction } from '@/pages/stake/hooks/useStakeTransaction';
import { useUnStakeTransaction } from '@/pages/stake/hooks/useUnStakeTransaction';

export function UnStakeFlowBlock() {
  const { isConnected } = useConnection();

  const { COMPBalance } = useStakeTransaction();

  const {
    isLockedCOMPBalanceFetching,
    isUnstakeRequestPending,
    isUnstakeRequestConfirming,
    isUnlockRequestPending,
    isUnlockRequestConfirming,
    lockedCOMPData,
    hasActiveLock,
    onUnstake
  } = useUnStakeTransaction();

  const lockedCOMPBalanceFormatted = formatUnits(lockedCOMPData.amount, ENV.BASE_TOKEN_DECIMALS);
  const { isUnlocked, countdownLabel } = FormatTime.lockInfo(lockedCOMPData.startTime, lockedCOMPData.duration);

  const isUnStakeButtonDisabled =
    !isConnected ||
    (Number(COMPBalance.principal) === 0 && !isUnlocked) ||
    isUnstakeRequestPending ||
    isUnlockRequestPending ||
    isUnstakeRequestConfirming ||
    isUnlockRequestConfirming;

  const isInfoVisible = isConnected && isUnlocked;

  const coolDownValue = lockedCOMPData.startTime ? countdownLabel : '-';

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
              <Skeleton loading={isLockedCOMPBalanceFetching}>
                <Text
                  size='17'
                  weight='500'
                  lineHeight='17'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {isConnected ? Format.token(lockedCOMPBalanceFormatted, 'standard') : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Cooldown
              </Text>
              <Skeleton loading={isLockedCOMPBalanceFetching}>
                <Text
                  size='17'
                  weight='500'
                  lineHeight='17'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected || !lockedCOMPData.startTime
                  })}
                >
                  {isConnected ? coolDownValue : '-'}
                </Text>
              </Skeleton>
            </div>
          </div>
          <Button
            disabled={isUnStakeButtonDisabled}
            className='max-w-32.5 text-[11px] font-medium'
            onClick={onUnstake}
          >
            {hasActiveLock ? 'Unstake' : 'Request unstake'}
          </Button>
        </div>
      </Card>
      <Condition if={isInfoVisible}>
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
