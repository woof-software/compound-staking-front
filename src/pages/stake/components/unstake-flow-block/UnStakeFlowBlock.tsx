import { useState } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { CoolDown } from '@/components/common/CoolDown';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useUnlockRequest } from '@/pages/stake/hooks/useUnlockRequest';
import { useUnstakeRequest } from '@/pages/stake/hooks/useUnstakeRequest';

export function UnStakeFlowBlock() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  // const { onIsStakeFlowDisabledToggle } = useStakeStore();

  const { isConnected, address } = useConnection();

  const { data: baseTokenBalance } = useStakedBalance(address);
  const { data: lockedTokenBalance, isFetching: isLockedTokenBalanceFetching } = useLockedBalance(address);

  const { remainingSeconds } = FormatTime.lockInfo(
    lockedTokenBalance?.startTime ?? 0,
    lockedTokenBalance?.duration ?? 0
  );
  const lockedCOMPBalanceFormatted = formatUnits(BigInt(lockedTokenBalance?.amount ?? 0), ENV.BASE_TOKEN_DECIMALS);

  const {
    // sendTransactionAsync: unstakeRequest,
    data: unstakeRequestHash,
    isPending: isUnstakePending
  } = useUnstakeRequest();
  const { isLoading: isUnstakeRequestConfirming } = useWaitForTransactionReceipt({
    hash: unstakeRequestHash
  });

  const {
    sendTransactionAsync: unlockRequest,
    data: unlockRequestHash,
    isPending: inUnlockPending
  } = useUnlockRequest();
  const { isLoading: isUnlockRequestConfirming } = useWaitForTransactionReceipt({
    hash: unlockRequestHash
  });

  const hasActiveLock = BigInt(lockedTokenBalance?.amount ?? 0) > 0n;
  const isInfoVisible = isConnected && isUnlocked;

  // const onUnstakeRequest = async () => {
  //   onIsStakeFlowDisabledToggle(true);
  //
  //   try {
  //     await unstakeRequest(ENV.STAKING_VAULT_ADDRESS);
  //   } finally {
  //     onIsStakeFlowDisabledToggle(false);
  //   }
  // };

  const onButtonClick = async () => {
    if (hasActiveLock) {
      // onOpen();
    } else {
      await unlockRequest(ENV.LOCK_MANAGER_ADDRESS);
    }
  };

  ////////////////
  const isUnStakeButtonDisabled =
    !isConnected ||
    isUnstakePending ||
    inUnlockPending ||
    isUnstakeRequestConfirming ||
    isUnlockRequestConfirming ||
    (BigInt(baseTokenBalance?.principal ?? 0) === 0n && !isUnlocked);

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
              <Skeleton loading={isLockedTokenBalanceFetching}>
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
              <Skeleton loading={isLockedTokenBalanceFetching}>
                <CoolDown
                  totalSeconds={remainingSeconds}
                  isDisabled={isConnected && !!lockedTokenBalance?.startTime}
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected || !lockedTokenBalance?.startTime
                  })}
                  onStateChange={(isUnlocked) => setIsUnlocked(isUnlocked)}
                />
              </Skeleton>
            </div>
          </div>
          <Button
            disabled={isUnStakeButtonDisabled}
            className='max-w-32.5 text-[11px] font-medium'
            onClick={onButtonClick}
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
