import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { CoolDown } from '@/components/common/CoolDown';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
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
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { setIsPendingToggle } = useWalletStore();

  const { isConnected, address } = useConnection();

  const { data: baseTokenBalance, refetch: refetchBaseTokenBalance } = useStakedBalance(address);

  const { refetch: refetchStakedTokenBalance } = useStakedVirtualBalance(address);

  const {
    data: lockedTokenBalance,
    lockDuration,
    isLoading: isLockedTokenBalanceLoading,
    refetch: refetchLockedTokenBalance
  } = useLockedBalance(address);

  const { data: baseTokenPriceUsdData, isLoading: isBaseTokenPriceUsdLoading } = useTokenPrice(
    ENV.BASE_TOKEN_PRICE_FEED_ADDRESS
  );

  const { remainingSeconds } = FormatTime.lockInfo(
    lockedTokenBalance?.startTime ?? 0,
    lockedTokenBalance?.duration ?? 0
  );
  const lockedCOMPBalanceFormatted = formatUnits(BigInt(lockedTokenBalance?.amount ?? 0), ENV.BASE_TOKEN_DECIMALS);

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
    isPending: inUnlockPending
  } = useUnlockRequest();
  const { isLoading: isUnlockRequestConfirming, isSuccess: isUnlockRequestSuccess } = useWaitForTransactionReceipt({
    hash: unlockRequestHash
  });

  const hasActiveLock = BigInt(lockedTokenBalance?.amount ?? 0) > 0n;
  const isInfoVisible = isConnected && isUnlocked;

  /* Loading */
  const isUnstakeLoading = isUnstakePending || isUnstakeRequestConfirming;
  const isUnlockLoading = inUnlockPending || isUnlockRequestConfirming;
  const isUnstakeButtonDisabled =
    !isConnected ||
    isOpen ||
    isBaseTokenPriceUsdLoading ||
    isUnstakeLoading ||
    isUnlockLoading ||
    (!isUnlocked && BigInt(baseTokenBalance?.principal ?? 0) === 0n);

  const onUnstakeRequest = async () => {
    setIsPendingToggle(true);
    await unstakeRequest(ENV.STAKING_VAULT_ADDRESS);
  };

  const onButtonClick = async () => {
    if (hasActiveLock) {
      await unlockRequest(ENV.LOCK_MANAGER_ADDRESS);
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    setIsPendingToggle(isUnstakeLoading || isUnlockLoading);
  }, [isUnstakeLoading, isUnlockLoading]);

  useEffect(() => {
    if (isUnstakeRequestSuccess || isUnlockRequestSuccess) {
      refetchBaseTokenBalance();
      refetchStakedTokenBalance();
      refetchLockedTokenBalance();
    }
  }, [isUnstakeRequestSuccess, isUnlockRequestSuccess]);

  console.log('----');
  // console.log('lockedTokenBalance=>', lockedTokenBalance);
  console.log('hasActiveLock=>', hasActiveLock);
  console.log('baseTokenBalance=>', baseTokenBalance);
  console.log('isUnlocked=>', isUnlocked);
  console.log('isUnstakeButtonDisabled 1111=>', isUnstakeButtonDisabled);

  console.log('remainingSeconds=>', remainingSeconds);

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
              <Skeleton loading={isLockedTokenBalanceLoading}>
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
              <Skeleton loading={isLockedTokenBalanceLoading}>
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
            disabled={isUnstakeButtonDisabled}
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
      <Modal
        title='Unstake'
        open={isOpen}
        onClose={onClose}
      >
        <UnstakeModal
          isLoading={isUnstakeLoading}
          lockDuration={lockDuration}
          baseTokenPriceUsdData={baseTokenPriceUsdData}
          baseTokenBalance={baseTokenBalance?.principal}
          onClick={onUnstakeRequest}
        />
      </Modal>
    </div>
  );
}
