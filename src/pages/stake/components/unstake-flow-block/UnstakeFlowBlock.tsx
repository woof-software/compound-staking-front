import { useEffect, useMemo, useRef, useState } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Duration } from '@/components/common/Duration';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useStakedTokenAllowance } from '@/hooks/useStakedTokenAllowance';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useWalletStore } from '@/hooks/useWallet';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import { UnstakeModal } from '@/pages/stake/components/unstake-flow-block/UnstakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useStakedVirtualBalance } from '@/pages/stake/hooks/useStakedVirtualBalance';
import { useUnlockRequest } from '@/pages/stake/hooks/useUnlockRequest';
import { useUnstakeRequest } from '@/pages/stake/hooks/useUnstakeRequest';

export function UnstakeFlowBlock() {
  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const prevSecondsLeftRef = useRef<number>(0);

  const { setIsPendingToggle } = useWalletStore();
  const { isConnected, address } = useConnection();

  const { refetch: refetchAllowance } = useStakedTokenAllowance(address);

  const { data: stakedTokenBalance, refetch: refetchStakedTokenBalance } = useStakedBalance(address);
  const { refetch: refetchVirtualTokenBalance } = useStakedVirtualBalance(address);

  const {
    data: lockedTokenBalance,
    refetch: refetchLockedTokenBalance,
    isLoading: isLockedTokenBalanceLoading
  } = useLockedBalance(address);

  const { data: stakedTokenPrice, isLoading: isStakedTokenPrice } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const {
    sendTransactionAsync: unstakeRequest,
    data: unstakeRequestHash,
    isPending: isUnstakePending
  } = useUnstakeRequest();

  const { isLoading: isUnstakeRequestConfirming, isSuccess: isUnstakeRequestSuccess } = useWaitForTransactionReceipt({
    hash: unstakeRequestHash
  });

  const {
    sendTransactionAsync: unlockRequest,
    data: unlockRequestHash,
    isPending: isUnlockPending
  } = useUnlockRequest();

  const { isLoading: isUnlockRequestConfirming, isSuccess: isUnlockRequestSuccess } = useWaitForTransactionReceipt({
    hash: unlockRequestHash
  });

  const lockedStakedBalanceFormatted = formatUnits(lockedTokenBalance?.amount ?? 0n, ENV.BASE_TOKEN_DECIMALS);
  const lockedStakedBalancePriceFormatted = formatUnits(
    (lockedTokenBalance?.amount ?? 0n) * (stakedTokenPrice ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const lockEndMs = useMemo(() => {
    const startSec = lockedTokenBalance?.startTime ?? 0;
    const durationSec = lockedTokenBalance?.duration ?? 0;
    console.log('startSec=>', startSec);
    console.log('durationSec=>', durationSec);
    const endSec = startSec + durationSec;

    console.log('endSec=>', endSec);

    return endSec > 0 ? Date.now() + endSec * 1000 : 0;
  }, [lockedTokenBalance?.startTime, lockedTokenBalance?.duration]);

  const hasActiveLock = (lockedTokenBalance?.amount ?? 0n) > 0n;

  const isInfoVisible = isConnected && hasActiveLock && secondsLeft === 0;
  const hasSomethingToUnstake = (stakedTokenBalance?.principal ?? 0n) > 0n || (lockedTokenBalance?.amount ?? 0n) > 0n;
  const isCooldownBlocked = hasActiveLock && secondsLeft > 0;

  /* Loading */
  const isLoading = isLockedTokenBalanceLoading;
  const isTransactionLoading =
    isUnstakePending || isUnstakeRequestConfirming || isUnlockPending || isUnlockRequestConfirming;

  const isUnstakeButtonDisabled =
    !isConnected || isOpen || isTransactionLoading || isLoading || !hasSomethingToUnstake || isCooldownBlocked;

  const onUnstakeRequest = async () => {
    setIsPendingToggle(true);
    try {
      await unstakeRequest(ENV.STAKING_VAULT_ADDRESS);
    } finally {
      setIsPendingToggle(false);
    }
  };

  const onButtonClick = async () => {
    if (hasActiveLock) {
      await unlockRequest(ENV.LOCK_MANAGER_ADDRESS);
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    if (!hasActiveLock || lockEndMs <= 0) {
      setSecondsLeft(0);
      prevSecondsLeftRef.current = 0;
      return;
    }

    const diffMs = lockEndMs - Date.now();
    const next = Math.max(0, Math.ceil(diffMs / 1000));
    setSecondsLeft(next);
    prevSecondsLeftRef.current = next;
  }, [hasActiveLock, lockEndMs]);

  useEffect(() => {
    prevSecondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    setIsPendingToggle(isTransactionLoading);
  }, [isTransactionLoading]);

  useEffect(() => {
    if (isUnlockRequestSuccess) {
      refetchAllowance();
    }

    if (isUnstakeRequestSuccess || isUnlockRequestSuccess) {
      refetchVirtualTokenBalance();
      refetchStakedTokenBalance();
      refetchLockedTokenBalance();
    }

    if (isUnstakeRequestSuccess) {
      onClose();
    }
  }, [
    isUnstakeRequestSuccess,
    isUnlockRequestSuccess,
    refetchAllowance,
    refetchVirtualTokenBalance,
    refetchStakedTokenBalance,
    refetchLockedTokenBalance,
    onClose
  ]);

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
                <Skeleton loading={isLoading}>
                  <Text
                    size='17'
                    weight='500'
                    lineHeight='17'
                    className={cn('text-color-2', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {isConnected && !!lockedTokenBalance?.amount
                      ? Format.token(lockedStakedBalanceFormatted, 'standard')
                      : '0.0000'}{' '}
                    COMP
                  </Text>
                </Skeleton>
                <Condition if={isConnected && !!lockedTokenBalance?.amount}>
                  <Skeleton loading={isLoading || isStakedTokenPrice}>
                    <Text
                      size='11'
                      className='text-color-24'
                    >
                      {Format.price(lockedStakedBalancePriceFormatted, 'standard')}
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
              <Skeleton loading={isLoading}>
                <Duration
                  onChange={setSecondsLeft}
                  end={hasActiveLock ? lockEndMs : 0}
                  render={(seconds) => (
                    <Text
                      size='17'
                      weight='500'
                      lineHeight='17'
                      className={cn('text-color-2', {
                        'text-color-6': !isConnected || !lockedTokenBalance?.startTime
                      })}
                    >
                      {Boolean(isConnected && !!lockedTokenBalance?.startTime)
                        ? FormatTime.cooldownFromSeconds(seconds)
                        : '-'}
                    </Text>
                  )}
                />
              </Skeleton>
            </div>
          </div>
          <Button
            disabled={isUnstakeButtonDisabled}
            className={cn('max-w-32.5 text-[11px] font-medium', {
              'text-white': !isUnstakeButtonDisabled
            })}
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
      <Modal
        title='Unstake'
        open={isOpen}
        onClose={onClose}
      >
        <UnstakeModal
          isLoading={isUnstakePending || isUnstakeRequestConfirming}
          onClick={onUnstakeRequest}
        />
      </Modal>
    </div>
  );
}
