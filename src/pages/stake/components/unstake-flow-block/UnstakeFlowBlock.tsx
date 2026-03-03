import { useEffect, useEffectEvent } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

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
import { getAddressContracts, when } from '@/lib/utils/helpers';
import { UnstakeModal } from '@/pages/stake/components/unstake-flow-block/UnstakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useStakedVirtualBalance } from '@/pages/stake/hooks/useStakedVirtualBalance';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';
import { useTotalStaked } from '@/pages/stake/hooks/useTotalStaked';
import { useUnlockTransactions } from '@/pages/stake/hooks/useUnlockTransaction';
import { useUnstakeTransaction } from '@/pages/stake/hooks/useUnstakeTransaction';
import { useUserAPR } from '@/pages/stake/hooks/useUserAPR';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useRewardStore } from '@/stores/useRewardStore';
import { trySwitchToApplicationChain } from '@/stores/useSwitchNetworkModalStore';
import { useWalletStore } from '@/stores/useWalletStore';

import CompoundBlackCircle from '@/assets/svg/compound-black-circle.svg';
import InfoIcon from '@/assets/svg/info.svg';

export function UnstakeFlowBlock() {
  const { isEnabled: isModalFrameOpen, enable: openModalFrame, disable: closeModalFrame } = useSwitch();

  const isDesktop = useMediaQuery(MIN_1024);

  const setGlobalTransactionLoader = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);
  const triggerDelegateRefresh = useDelegateStore(({ triggerRefresh }) => triggerRefresh);
  const triggerRewardRefresh = useRewardStore(({ triggerRefresh }) => triggerRefresh);

  const { isConnected, address, chainId } = useConnection();

  const { baseTokenAddress, lockManagerAddress } = getAddressContracts(APPLICATION_CHAIN);

  const { data: lockDurationSec } = useUnstakeLockDuration(APPLICATION_CHAIN, lockManagerAddress);

  const { refetch: refetchAllowance } = useBaseTokenAllowance(APPLICATION_CHAIN, address);

  const { data: stakedTokenBalance, refetch: refetchStakedTokenBalance } = useStakedBalance(APPLICATION_CHAIN, address);
  const { refetch: refetchVirtualTokenBalance } = useStakedVirtualBalance(APPLICATION_CHAIN, address);
  const { refetch: refetchMultiplier } = useMultiplier(APPLICATION_CHAIN, address);
  const { refetch: refetchAvailableRewards } = useAvailableRewards(APPLICATION_CHAIN, address);
  const { refetch: refetchTotalStaked } = useTotalStaked(APPLICATION_CHAIN);

  const { refetch: refetchWalletBalance } = useTokenBalance(address, baseTokenAddress);

  const {
    data: lockedTokenBalance,
    refetch: refetchLockedTokenBalance,
    isLoading: isLockedTokenBalanceLoading
  } = useLockedBalance(APPLICATION_CHAIN, address);

  const { data: stakedTokenPrice, isLoading: isStakedTokenPrice } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { refetch: refetchUserAPR } = useUserAPR(address, APPLICATION_CHAIN);

  const { refetch: refetchStatisticStakingAPR } = useStatisticStakingAPR(APPLICATION_CHAIN);

  const sentUnlockTransactions = useUnlockTransactions(APPLICATION_CHAIN);

  const latestUnlockTransactionState = sentUnlockTransactions.at(-1);

  const { isLoading: isUnlockTransactionMining, isSuccess: isUnlockTransactionSucceed } = useWaitForTransactionReceipt({
    hash: latestUnlockTransactionState?.state.data
  });

  const {
    data: unstakeTransactionHash,
    sendTransactionAsync: initiateUnstakeTransaction,
    isPending: isUnstakeTransactionConfirming
  } = useUnstakeTransaction(APPLICATION_CHAIN);

  const { isLoading: isUnstakeTransactionMining, isSuccess: isUnstakeTransactionSucceed } =
    useWaitForTransactionReceipt({
      hash: unstakeTransactionHash
    });

  const lockedStakedBalanceFormatted = formatUnits(lockedTokenBalance?.amount ?? 0n, ENV.BASE_TOKEN_DECIMALS);
  const lockedStakedBalancePriceFormatted = formatUnits(
    (lockedTokenBalance?.amount ?? 0n) * (stakedTokenPrice ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const hasStakedTokens = (stakedTokenBalance?.principal ?? 0n) > 0n;
  const hasTokensToUnstake = (lockedTokenBalance?.amount ?? 0n) > 0n;

  let unstakeLockedUntilMs = 0;

  if (hasTokensToUnstake) {
    const cooldownDurationSec = Number((lockedTokenBalance?.startTime ?? 0n) + (lockedTokenBalance?.duration ?? 0n));

    unstakeLockedUntilMs = (cooldownDurationSec + BASE_COOLDOWN_BUFFER_SECONDS) * 1000;
  }

  const {
    isEnabled: isLockedByCooldown,
    enable: activateCooldownLock,
    disable: deactivateCooldownLock
  } = useSwitch(unstakeLockedUntilMs > Date.now());

  useExecuteAtTime(deactivateCooldownLock, unstakeLockedUntilMs);

  useEffect(() => {
    if (Date.now() > unstakeLockedUntilMs) {
      deactivateCooldownLock();
    } else {
      activateCooldownLock();
    }
  }, [unstakeLockedUntilMs]);

  const isUnstakeAvailable = isConnected && hasTokensToUnstake && !isLockedByCooldown;

  const isProcessingTargetTransaction = (() => {
    // We are interested to track only 2 pending transactions here:
    // 1. Unlock transaction
    const isUnlockTransactionConfirming = latestUnlockTransactionState?.state.status === 'pending';

    if (isUnlockTransactionConfirming) return true;
    if (isUnlockTransactionMining) return true;

    // 2. Release transaction
    if (isUnstakeTransactionConfirming) return true;
    if (isUnstakeTransactionMining) return true;

    return false;
  })();

  useEffect(() => {
    setGlobalTransactionLoader(isProcessingTargetTransaction);
  }, [isProcessingTargetTransaction, setGlobalTransactionLoader]);

  const isButtonDisabled = (() => {
    // Disable if a system knows nothing about user-staked tokens
    if (isLockedTokenBalanceLoading) return true;

    // Should be disabled if there are no tokens to unlock or unstake
    if (!hasTokensToUnstake && !hasStakedTokens) return true;

    // Disable if UI has to be locked because of the cooldown
    if (isLockedByCooldown) return true;

    // Disabled if one of target transactions in progress
    if (isProcessingTargetTransaction) return true;

    // UI should disable the button while the internal modal frame is opened
    if (isModalFrameOpen) return true;

    // Disabled if the user has no active wallet connection
    if (!isConnected) return true;

    return false;
  })();

  const onButtonClick = async () => {
    if (isButtonDisabled) return;

    trySwitchToApplicationChain(chainId);

    if (hasTokensToUnstake) {
      await initiateUnstakeTransaction();
    } else {
      openModalFrame();
    }
  };

  const onRequestSuccess = useEffectEvent(() => {
    triggerDelegateRefresh();
    triggerRewardRefresh();

    refetchWalletBalance();
    refetchStakedTokenBalance();
    refetchVirtualTokenBalance();
    refetchMultiplier();
    refetchAvailableRewards();
    refetchLockedTokenBalance();
    refetchUserAPR();
    refetchStatisticStakingAPR();
    refetchTotalStaked();
  });

  useEffect(() => {
    if (isUnlockTransactionSucceed) {
      refetchAllowance();
    }

    if (isUnlockTransactionSucceed || isUnstakeTransactionSucceed) {
      onRequestSuccess();
    }

    if (isUnlockTransactionSucceed) {
      closeModalFrame();
    }
  }, [isUnlockTransactionSucceed, isUnstakeTransactionSucceed]);

  return (
    <div className='flex flex-col gap-1.5'>
      <Card
        isLoading={isLockedTokenBalanceLoading}
        title='Unstake'
        tooltip={`Unstaking cooldown: ${FormatTime.cooldownFromSeconds(Number(lockDurationSec ?? 0))} + 1 block offset (${FormatTime.cooldownFromSeconds(BASE_COOLDOWN_BUFFER_SECONDS)}).`}
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
                <Skeleton loading={isLockedTokenBalanceLoading}>
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
                  <Skeleton loading={isLockedTokenBalanceLoading || isStakedTokenPrice}>
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
              <Skeleton loading={isLockedTokenBalanceLoading}>
                <Duration
                  end={unstakeLockedUntilMs}
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
            disabled={isButtonDisabled}
            className='max-w-full md:max-w-32.5'
            onClick={onButtonClick}
          >
            <Skeleton
              loading={isLockedTokenBalanceLoading}
              className='w-full'
            >
              <Text
                tag='p'
                size='11'
                align='center'
                className={cn('text-color-6', {
                  'text-white': !isButtonDisabled
                })}
              >
                {hasTokensToUnstake ? 'Unstake' : 'Request Unstake'}
              </Text>
            </Skeleton>
          </Button>
        </div>
      </Card>
      <Condition if={isUnstakeAvailable}>
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
          open={isModalFrameOpen}
          onClose={closeModalFrame}
        >
          <UnstakeModal />
        </Modal>
      </Condition>
      <Condition if={!isDesktop}>
        <Drawer
          isOpen={isModalFrameOpen}
          onClose={closeModalFrame}
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
