import { useEffect, useEffectEvent, useMemo } from 'react';
import { useConnection } from 'wagmi';

import { ExternalLinkIcon } from '@/assets/svg';
import { Duration } from '@/components/common/Duration';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { useDelegateDuration } from '@/hooks/useDelegateDuration';
import { useDelegateSubAccount } from '@/hooks/useDelegateSubAccount';
import { useExecuteAtTime } from '@/hooks/useExecuteAtTime';
import { useSubAccount } from '@/hooks/useSubAccount';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { FormatTime } from '@/lib/utils/format';
import { getDelegateByAddress, getExplorerAddressUrl, getRemainingSeconds } from '@/lib/utils/helpers';
import { DelegateModal } from '@/pages/stake/components/delegate-flow-block/DelegateModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useWalletStore } from '@/stores/useWalletStore';

export function DelegateFlowBlock() {
  const { isConnected, address } = useConnection();

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);
  const { needRefresh: needDelegateRefresh, resetRefresh: resetDelegateRefresh } = useDelegateStore();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { isEnabled: isCooldownFinished, enable: setCooldownFinished, disable: resetCooldownFinished } = useSwitch();

  const { data: stakedTokenBalance } = useStakedBalance(APPLICATION_CHAIN, address);
  const { data: lockedTokenBalance } = useLockedBalance(APPLICATION_CHAIN, address);

  const { data: delegateDuration, isLoading: isDurationLoading } = useDelegateDuration(APPLICATION_CHAIN);

  const {
    data: subAccountAddress,
    isLoading: isSubAccountLoading,
    refetch: refetchSubAccountAddress
  } = useDelegateSubAccount(APPLICATION_CHAIN, address);

  const {
    data: delegateData,
    isLoading: isDelegateLoading,
    refetch: refetchDelegate
  } = useSubAccount(APPLICATION_CHAIN, subAccountAddress);

  const executableAtSec = useMemo(() => {
    const executableAt = delegateData?.executableAt;

    if (!executableAt) return 0;

    return Number(executableAt);
  }, [delegateData?.executableAt]);

  const hasOpenPosition = (stakedTokenBalance?.principal ?? 0n) > 0n || (lockedTokenBalance?.amount ?? 0n) > 0n;

  const hasActiveLock = (lockedTokenBalance?.amount ?? 0n) > 0n;

  const hasCooldownRequest = !!executableAtSec && !delegateData?.executed;

  const canShowDelegation = isConnected && hasOpenPosition && !hasActiveLock;

  const isCooldownBlocked = isConnected && !isCooldownFinished;

  const isLoading = hasOpenPosition ? isSubAccountLoading || isDelegateLoading || isDurationLoading : false;

  const isDelegateButtonDisabled =
    !isConnected || isOpen || isLoading || isCooldownBlocked || !hasOpenPosition || hasActiveLock;

  const cooldownEndMs = !canShowDelegation || !hasCooldownRequest ? 0 : executableAtSec * 1000;

  const remainingSeconds = !canShowDelegation || !hasCooldownRequest ? 0 : getRemainingSeconds(executableAtSec);

  const endDateLabel = !canShowDelegation || !hasCooldownRequest ? '-' : FormatTime.endDate(executableAtSec);

  const delegate = getDelegateByAddress(delegateData?.delegatee);

  const delegateLabel = !canShowDelegation ? '-' : delegate?.name || delegate?.address || '-';

  const onDelegateConfirmed = async () => {
    await refetchDelegate();
  };

  const onModalClose = () => {
    setIsPendingToggle(false);
    onClose();
  };

  const onRefetchData = useEffectEvent(() => {
    refetchSubAccountAddress();
    refetchDelegate();

    resetDelegateRefresh();
  });

  useEffect(() => {
    if (!isConnected || isLoading || !hasCooldownRequest || hasActiveLock) {
      setCooldownFinished();
      return;
    }

    if (remainingSeconds > 0) {
      resetCooldownFinished();
    } else {
      setCooldownFinished();
    }
  }, [isConnected, isLoading, hasCooldownRequest, hasActiveLock, remainingSeconds]);

  useEffect(() => {
    if (!isConnected || !needDelegateRefresh) return;

    onRefetchData();
  }, [needDelegateRefresh, isConnected]);

  useExecuteAtTime(setCooldownFinished, hasActiveLock ? 0 : cooldownEndMs);

  return (
    <Card
      isLoading={isLoading}
      title='Delegation'
      tooltip={`Cooldown period for redelegation process is ${FormatTime.cooldownFromSeconds(Number(delegateDuration ?? 0n))}`}
    >
      <div className='flex justify-between p-10'>
        <div className='flex gap-15'>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Name of Delegatee
            </Text>
            <Skeleton loading={isLoading}>
              {canShowDelegation && delegate?.address ? (
                <a
                  className='flex cursor-pointer items-start gap-1'
                  target='_blank'
                  href={getExplorerAddressUrl(delegate.address)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Text
                    size='17'
                    lineHeight='17'
                    className={cn('text-color-2 max-w-36 truncate')}
                  >
                    {delegate?.name || delegate.address}
                  </Text>
                  <ExternalLinkIcon className='text-color-24' />
                </a>
              ) : (
                <Text
                  size='17'
                  lineHeight='17'
                  className='text-color-6'
                >
                  {delegateLabel}
                </Text>
              )}
            </Skeleton>
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
                end={cooldownEndMs}
                unsafeRound={(msLeft) => Math.max(Math.ceil(msLeft / 1000), 0)}
                render={(seconds) => (
                  <Text
                    size='17'
                    lineHeight='17'
                    className={cn('text-color-2 tabular-nums', { 'text-color-6': !canShowDelegation })}
                  >
                    {canShowDelegation && seconds !== undefined ? FormatTime.cooldownFromSeconds(seconds) : '-'}
                  </Text>
                )}
              />
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              End Date
            </Text>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                lineHeight='17'
                className={cn('text-color-2', { 'text-color-6': !canShowDelegation })}
              >
                {canShowDelegation ? endDateLabel : '-'}
              </Text>
            </Skeleton>
          </div>
        </div>
        <Button
          onClick={onOpen}
          disabled={isDelegateButtonDisabled}
          className='max-w-32.5'
        >
          <Skeleton
            loading={isLoading}
            className='w-full'
          >
            <Text
              tag='p'
              size='11'
              align='center'
              className={cn('text-color-6', { 'text-white': !isDelegateButtonDisabled })}
            >
              Delegate
            </Text>
          </Skeleton>
        </Button>
      </div>
      <Modal
        open={isOpen}
        title='Delegate'
        onClose={onModalClose}
      >
        <DelegateModal
          subAccountAddress={subAccountAddress}
          delegate={delegate}
          onClose={onClose}
          onDelegateConfirmed={onDelegateConfirmed}
        />
      </Modal>
    </Card>
  );
}
