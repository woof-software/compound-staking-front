import { useEffect, useEffectEvent, useMemo } from 'react';
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
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useBaseTokenAllowance } from '@/hooks/useBaseTokenAllowance';
import { useExecuteAtTime } from '@/hooks/useExecuteAtTime';
import { useUnstakeLockDuration } from '@/hooks/useLockDuration';
import { useMultiplier } from '@/hooks/useMultiplier';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import {
  getAddressContracts,
  getRemainingSeconds,
  normalizeUnixSeconds,
  trySwitchToApplicationChain
} from '@/lib/utils/helpers';
import { UnstakeModal } from '@/pages/stake/components/unstake-flow-block/UnstakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useStakedVirtualBalance } from '@/pages/stake/hooks/useStakedVirtualBalance';
import { useUnlockRequest } from '@/pages/stake/hooks/useUnlockRequest';
import { useUnstakeRequest } from '@/pages/stake/hooks/useUnstakeRequest';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useRewardStore } from '@/stores/useRewardStore';
import { useWalletStore } from '@/stores/useWalletStore';

export function UnstakeFlowBlock() {
  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const {
    isEnabled: isDurationFinished,
    enable: setIsDurationFinished,
    disable: resetIsDurationFinished
  } = useSwitch();

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);
  const triggerDelegateRefresh = useDelegateStore(({ triggerRefresh }) => triggerRefresh);
  const triggerRewardRefresh = useRewardStore(({ triggerRefresh }) => triggerRefresh);

  const { isConnected, address, chainId } = useConnection();

  const { baseTokenAddress, lockManagerAddress } = getAddressContracts(APPLICATION_CHAIN);

  const { data: lockDuration } = useUnstakeLockDuration(APPLICATION_CHAIN, lockManagerAddress);

  const { refetch: refetchAllowance } = useBaseTokenAllowance(APPLICATION_CHAIN, address);

  const { data: stakedTokenBalance, refetch: refetchStakedTokenBalance } = useStakedBalance(APPLICATION_CHAIN, address);
  const { refetch: refetchVirtualTokenBalance } = useStakedVirtualBalance(APPLICATION_CHAIN, address);
  const { refetch: refetchMultiplier } = useMultiplier(APPLICATION_CHAIN, address);
  const { refetch: refetchAvailableRewards } = useAvailableRewards(APPLICATION_CHAIN, address);

  const { refetch: refetchWalletBalance } = useTokenBalance(address, baseTokenAddress);

  const {
    data: lockedTokenBalance,
    refetch: refetchLockedTokenBalance,
    isLoading: isLockedTokenBalanceLoading
  } = useLockedBalance(APPLICATION_CHAIN, address);

  const { data: stakedTokenPrice, isLoading: isStakedTokenPrice } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const {
    data: unstakeHash,
    sendTransactionAsync: unstakeRequest,
    isPending: isUnstakePending
  } = useUnstakeRequest(APPLICATION_CHAIN);

  const { isLoading: isUnstakeRequestConfirming, isSuccess: isUnstakeRequestSuccess } = useWaitForTransactionReceipt({
    hash: unstakeHash
  });

  const {
    data: unlockHash,
    sendTransactionAsync: unlockRequest,
    isPending: isUnlockPending
  } = useUnlockRequest(APPLICATION_CHAIN);

  const { isLoading: isUnlockRequesConfirming, isSuccess: isUnlockRequestSuccess } = useWaitForTransactionReceipt({
    hash: unlockHash
  });

  const lockedStakedBalanceFormatted = formatUnits(lockedTokenBalance?.amount ?? 0n, ENV.BASE_TOKEN_DECIMALS);
  const lockedStakedBalancePriceFormatted = formatUnits(
    (lockedTokenBalance?.amount ?? 0n) * (stakedTokenPrice ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const hasActiveLock = (lockedTokenBalance?.amount ?? 0n) > 0n;
  const unlockTimestampSec = hasActiveLock
    ? normalizeUnixSeconds(Number(lockedTokenBalance?.startTime ?? 0n)) + Number(lockedTokenBalance?.duration ?? 0n)
    : 0;
  const remainingSeconds = hasActiveLock ? getRemainingSeconds(unlockTimestampSec) : 0;

  const isBalancesLoading = isLockedTokenBalanceLoading || (isConnected && !lockedTokenBalance);

  const durationSec = useMemo(() => {
    if (isBalancesLoading || !hasActiveLock) return 0;

    return unlockTimestampSec * 1000;
  }, [isBalancesLoading, hasActiveLock, unlockTimestampSec]);

  const isInfoVisible = isConnected && !isBalancesLoading && hasActiveLock && isDurationFinished;
  const isCooldownBlocked = !isBalancesLoading && hasActiveLock && !isDurationFinished;
  const hasSomethingToUnstake =
    !isBalancesLoading && ((stakedTokenBalance?.principal ?? 0n) > 0n || (lockedTokenBalance?.amount ?? 0n) > 0n);

  /* Loading */
  const isLoading = isConnected ? isLockedTokenBalanceLoading : false;
  const isTransactionLoading =
    isUnstakePending || isUnlockPending || isUnstakeRequestConfirming || isUnlockRequesConfirming;

  const isUnstakeButtonDisabled =
    !isConnected || isOpen || isTransactionLoading || isBalancesLoading || !hasSomethingToUnstake || isCooldownBlocked;

  const onUnstakeRequest = async () => {
    setIsPendingToggle(true);
    try {
      await unstakeRequest();
    } finally {
      setIsPendingToggle(false);
    }
  };

  const onButtonClick = async () => {
    if (!lockManagerAddress) return;

    trySwitchToApplicationChain(chainId);

    if (hasActiveLock) {
      await unlockRequest();
    } else {
      onOpen();
    }
  };

  const onModalClose = () => {
    setIsPendingToggle(false);
    onClose();
  };

  const onRequestSuccess = useEffectEvent(async () => {
    triggerDelegateRefresh();
    triggerRewardRefresh();

    refetchWalletBalance();
    refetchStakedTokenBalance();
    refetchVirtualTokenBalance();
    refetchMultiplier();
    refetchAvailableRewards();
    refetchLockedTokenBalance();
  });

  useEffect(() => {
    setIsPendingToggle(isTransactionLoading);
  }, [isTransactionLoading]);

  useEffect(() => {
    if (isBalancesLoading) {
      resetIsDurationFinished();
      return;
    }

    if (!hasActiveLock) {
      resetIsDurationFinished();
      return;
    }

    if (remainingSeconds > 0) {
      resetIsDurationFinished();
    } else {
      setIsDurationFinished();
    }
  }, [isBalancesLoading, hasActiveLock, remainingSeconds]);

  useEffect(() => {
    if (isUnlockRequestSuccess) {
      refetchAllowance();
    }

    if (isUnstakeRequestSuccess || isUnlockRequestSuccess) {
      onRequestSuccess();
    }

    if (isUnstakeRequestSuccess) {
      onClose();
    }
  }, [isUnstakeRequestSuccess, isUnlockRequestSuccess]);

  useExecuteAtTime(setIsDurationFinished, durationSec);

  return (
    <div className='flex flex-col gap-1.5'>
      <Card
        isLoading={isLoading}
        title='Unstake'
        tooltip={`Cooldown period for unstaking process is ${FormatTime.cooldownFromSeconds(Number(lockDuration ?? 0))}`}
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
                    lineHeight='17'
                    className={cn('text-color-2 tabular-nums', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {Format.token(lockedStakedBalanceFormatted, 'standard', 'COMP')}
                  </Text>
                </Skeleton>
                <Condition if={isConnected && !!lockedTokenBalance?.amount}>
                  <Skeleton loading={isLoading || isStakedTokenPrice}>
                    <Text
                      size='11'
                      className='text-color-24 tabular-nums'
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
                  end={durationSec}
                  unsafeRound={(msLeft) => {
                    return Math.max(Math.ceil(msLeft / 1000), 0);
                  }}
                  render={(seconds) => {
                    const canShow = isConnected && !!lockedTokenBalance?.startTime && seconds !== undefined;

                    return (
                      <Text
                        size='17'
                        lineHeight='17'
                        className={cn('text-color-2 tabular-nums', {
                          'text-color-6': !isConnected || !lockedTokenBalance?.startTime
                        })}
                      >
                        {canShow ? FormatTime.cooldownFromSeconds(seconds) : '-'}
                      </Text>
                    );
                  }}
                />
              </Skeleton>
            </div>
          </div>
          <Button
            disabled={isUnstakeButtonDisabled}
            className='max-w-32.5'
            onClick={onButtonClick}
          >
            <Skeleton
              loading={isLoading}
              className='w-full'
            >
              <Text
                tag='p'
                size='11'
                align='center'
                className={cn('text-color-6', {
                  'text-white': !isUnstakeButtonDisabled
                })}
              >
                {hasActiveLock ? 'Unstake' : 'Request unstake'}
              </Text>
            </Skeleton>
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
        onClose={onModalClose}
      >
        <UnstakeModal
          isLoading={isTransactionLoading}
          onClick={onUnstakeRequest}
        />
      </Modal>
    </div>
  );
}
