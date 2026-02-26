import { useEffect, useEffectEvent } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Duration } from '@/components/common/Duration';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN, BASE_COOLDOWN_BUFFER_SECONDS } from '@/consts/common';
import { ENV } from '@/consts/env';
import { MIN_1024 } from '@/consts/media';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useBaseTokenAllowance } from '@/hooks/useBaseTokenAllowance';
import { useExecuteAtTime } from '@/hooks/useExecuteAtTime';
import { useUnstakeLockDuration } from '@/hooks/useLockDuration';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMultiplier } from '@/hooks/useMultiplier';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import { getAddressContracts, getRemainingSeconds, normalizeUnixSeconds, when } from '@/lib/utils/helpers';
import { UnstakeModal } from '@/pages/stake/components/unstake-flow-block/UnstakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useStakedVirtualBalance } from '@/pages/stake/hooks/useStakedVirtualBalance';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';
import { useUnlockRequest } from '@/pages/stake/hooks/useUnlockRequest';
import { useUnstakeRequests } from '@/pages/stake/hooks/useUnstakeRequest';
import { useUserAPR } from '@/pages/stake/hooks/useUserAPR';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useRewardStore } from '@/stores/useRewardStore';
import { trySwitchToApplicationChain } from '@/stores/useSwitchNetworkModalStore';
import { useWalletStore } from '@/stores/useWalletStore';

import CompoundBlackCircle from '@/assets/svg/compound-black-circle.svg';

export function UnstakeFlowBlock() {
  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const {
    isEnabled: isDurationFinished,
    enable: setIsDurationFinished,
    disable: resetIsDurationFinished
  } = useSwitch();

  const isDesktop = useMediaQuery(MIN_1024);

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

  const { refetch: refetchUerAPR } = useUserAPR(address, APPLICATION_CHAIN);

  const { refetch: refetchStatisticStakingAPR } = useStatisticStakingAPR(APPLICATION_CHAIN);

  const [earliestUnstakeRequestState] = useUnstakeRequests(APPLICATION_CHAIN);

  const { isLoading: isUnstakeTransactionMining, isSuccess: isUnstakeTransactionSucceed } =
    useWaitForTransactionReceipt({
      hash: earliestUnstakeRequestState?.state.data
    });

  const {
    data: unlockTransactionHash,
    sendTransactionAsync: sendUnlockTransaction,
    isPending: isUnlockTransactionConfirming
  } = useUnlockRequest(APPLICATION_CHAIN);

  const { isLoading: isUnlockTransactionMining, isSuccess: isUnlockTransactionSucceed } = useWaitForTransactionReceipt({
    hash: unlockTransactionHash
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

  let unstakeCooldownEnd = 0;

  if (!isBalancesLoading && hasActiveLock) {
    unstakeCooldownEnd = (unlockTimestampSec + BASE_COOLDOWN_BUFFER_SECONDS) * 1000;
  }

  const isInfoVisible = isConnected && !isBalancesLoading && hasActiveLock && isDurationFinished;
  const isCooldownBlocked = !isBalancesLoading && hasActiveLock && !isDurationFinished;
  const hasSomethingToUnstake =
    !isBalancesLoading && ((stakedTokenBalance?.principal ?? 0n) > 0n || (lockedTokenBalance?.amount ?? 0n) > 0n);

  /* Loading */
  const isLoading = isConnected ? isLockedTokenBalanceLoading : false;
  const isTransactionLoading =
    earliestUnstakeRequestState?.state.status === 'pending' ||
    isUnlockTransactionConfirming ||
    isUnstakeTransactionMining ||
    isUnlockTransactionMining;

  const isUnstakeButtonDisabled =
    !isConnected || isOpen || isTransactionLoading || isBalancesLoading || !hasSomethingToUnstake || isCooldownBlocked;

  const onButtonClick = async () => {
    if (!lockManagerAddress) return;

    trySwitchToApplicationChain(chainId);

    if (hasActiveLock) {
      await sendUnlockTransaction();
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
    refetchUerAPR();
    refetchStatisticStakingAPR();
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
    if (isUnlockTransactionSucceed) {
      refetchAllowance();
    }

    if (isUnstakeTransactionSucceed || isUnlockTransactionSucceed) {
      onRequestSuccess();
    }

    if (isUnstakeTransactionSucceed) {
      onClose();
    }
  }, [isUnstakeTransactionSucceed, isUnlockTransactionSucceed]);

  useExecuteAtTime(setIsDurationFinished, unstakeCooldownEnd);

  return (
    <div className='flex flex-col gap-1.5'>
      <Card
        isLoading={isLoading}
        title='Unstake'
        tooltip={`Unstaking cooldown: ${FormatTime.cooldownFromSeconds(Number(lockDuration ?? 0))} + 1 block offset (${FormatTime.cooldownFromSeconds(BASE_COOLDOWN_BUFFER_SECONDS)}).`}
      >
        <div className='flex flex-col items-start justify-between gap-10 p-5 md:flex-row md:p-10'>
          <div className='grid w-full grid-cols-1 flex-col gap-10 sm:grid-cols-2 md:flex md:flex-row md:gap-15'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Unstake
              </Text>
              <div className='flex flex-col gap-2.5 lg:gap-1'>
                <Skeleton loading={isLoading}>
                  <div className='flex items-center gap-1.5'>
                    <CompoundBlackCircle className='text-compound-icon-bg block size-4 lg:hidden' />
                    <Text
                      size='17'
                      lineHeight='17'
                      className={cn('text-color-2 tabular-nums', {
                        'text-color-6': !isConnected
                      })}
                    >
                      {Format.token(lockedStakedBalanceFormatted, { symbol: when(isDesktop, 'COMP') })}
                    </Text>
                  </div>
                </Skeleton>
                <Condition if={isConnected && lockedTokenBalance?.amount}>
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
                  end={unstakeCooldownEnd}
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
            className='max-w-full md:max-w-32.5'
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
                {hasActiveLock ? 'Unstake' : 'Request Unstake'}
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
            weight='500'
            className='text-color-7'
          >
            Funds are ready to be unstaked
          </Text>
        </div>
      </Condition>
      <Condition if={isDesktop}>
        <Modal
          title='Unstake'
          open={isOpen}
          onClose={onModalClose}
        >
          <UnstakeModal />
        </Modal>
      </Condition>
      <Condition if={!isDesktop}>
        <Drawer
          isOpen={isOpen}
          onClose={onModalClose}
        >
          <Text
            size='17'
            align='center'
            lineHeight='20'
          >
            Unstake
          </Text>
          <UnstakeModal />
        </Drawer>
      </Condition>
    </div>
  );
}
