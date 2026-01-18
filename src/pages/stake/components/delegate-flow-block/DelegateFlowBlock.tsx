import { useEffect, useMemo } from 'react';
import { useConnection } from 'wagmi';

import { ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Duration } from '@/components/common/Duration';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useDelegateByAddress } from '@/hooks/useDelegateByAddress';
import { useDelegateDuration } from '@/hooks/useDelegateDuration';
import { useDelegateSubAccount } from '@/hooks/useDelegateSubAccount';
import { useExecuteAtTime } from '@/hooks/useExecuteAtTime';
import { useSubAccount } from '@/hooks/useSubAccount';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { FormatTime } from '@/lib/utils/format';
import { getExplorerAddressUrl, getRemainingSeconds } from '@/lib/utils/helpers';
import { DelegateModal } from '@/pages/stake/components/delegate-flow-block/DelegateModal';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useDelegateStore } from '@/stores/useDelegateStore';

export function DelegateFlowBlock() {
  const { isConnected, address } = useConnection();

  const { needDelegateRefresh, resetDelegateRefresh } = useDelegateStore();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { isEnabled: isCooldownFinished, enable: setCooldownFinished, disable: resetCooldownFinished } = useSwitch();

  const { data: stakedTokenBalance } = useStakedBalance(address);

  const { data: delegateDuration, isLoading: isDurationLoading } = useDelegateDuration();

  const {
    data: subAccountAddress,
    isLoading: isSubAccountLoading,
    refetch: refetchSubAccountAddress
  } = useDelegateSubAccount(address);

  const {
    data: delegateData,
    isLoading: isDelegateLoading,
    refetch: refetchDelegate
  } = useSubAccount(subAccountAddress);

  const hasOpenPosition = (stakedTokenBalance?.principal ?? 0n) > 0n;

  const executableAtSec = useMemo(() => {
    const executableAt = delegateData?.executableAt;

    if (!executableAt) return 0;

    return Number(executableAt);
  }, [delegateData?.executableAt]);

  const hasCooldownRequest = !!executableAtSec && !delegateData?.executed;

  const isLoading = isSubAccountLoading || isDelegateLoading || isDurationLoading;

  const isCooldownBlocked = isConnected && !isCooldownFinished;

  const isDelegateButtonDisabled = !isConnected || isLoading || isCooldownBlocked || !hasOpenPosition;

  const cooldownEndMs = !isConnected || isLoading || !hasCooldownRequest ? 0 : executableAtSec * 1000;

  const remainingSeconds = !isConnected || isLoading || !hasCooldownRequest ? 0 : getRemainingSeconds(executableAtSec);

  const endDateLabel = !isConnected || isLoading || !hasCooldownRequest ? '-' : FormatTime.endDate(executableAtSec);

  const delegate = useDelegateByAddress(delegateData?.delegatee);

  const onDelegateConfirmed = () => {
    refetchDelegate();
  };

  useEffect(() => {
    if (!isConnected || isLoading || !hasCooldownRequest) {
      setCooldownFinished();
      return;
    }

    if (remainingSeconds > 0) {
      resetCooldownFinished();
    } else {
      setCooldownFinished();
    }
  }, [isConnected, isLoading, hasCooldownRequest, remainingSeconds, setCooldownFinished, resetCooldownFinished]);

  useEffect(() => {
    if (!isConnected || !needDelegateRefresh) return;

    refetchSubAccountAddress();
    refetchDelegate();

    resetDelegateRefresh();
  }, [needDelegateRefresh, isConnected]);

  useExecuteAtTime(setCooldownFinished, cooldownEndMs);

  return (
    <Card
      isLoading={isLoading}
      title='Delegation'
      tooltip={`Cooldown period for redelegation process is ${FormatTime.cooldownFromSeconds(delegateDuration ?? 0)}`}
    >
      <div className='flex justify-between p-10'>
        <div className='flex gap-15'>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              weight='500'
              className='text-color-24'
            >
              Name of Delegatee
            </Text>
            <Skeleton loading={isLoading}>
              <a
                className='flex cursor-pointer items-start gap-1'
                target='_blank'
                href={getExplorerAddressUrl(delegate?.address)}
                onClick={(e) => e.stopPropagation()}
              >
                <Text
                  size='17'
                  weight='500'
                  lineHeight='17'
                  className={cn('text-color-2 max-w-36 truncate', {
                    'text-color-6': !isConnected || !hasOpenPosition
                  })}
                >
                  {isConnected && hasOpenPosition ? delegate?.name || delegate?.address : '-'}
                </Text>
                <Condition if={isConnected && hasOpenPosition}>
                  <ExternalLinkIcon className='text-color-24' />
                </Condition>
              </a>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              weight='500'
              className='text-color-24'
            >
              Cooldown
            </Text>
            <Skeleton loading={isLoading}>
              <Duration
                end={cooldownEndMs}
                unsafeRound={(msLeft) => {
                  return Math.max(Math.ceil(msLeft / 1000), 0);
                }}
                render={(seconds) => {
                  const canShow = isConnected && hasOpenPosition && seconds !== undefined;

                  return (
                    <Text
                      size='17'
                      weight='500'
                      lineHeight='17'
                      className={cn('text-color-2 tabular-nums', { 'text-color-6': !isConnected || !hasOpenPosition })}
                    >
                      {canShow ? FormatTime.cooldownFromSeconds(seconds) : '-'}
                    </Text>
                  );
                }}
              />
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              weight='500'
              className='text-color-24'
            >
              End Date
            </Text>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected || !hasOpenPosition
                })}
              >
                {isConnected && hasOpenPosition ? endDateLabel : '-'}
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
              weight='500'
              align='center'
              className={cn('text-color-6', {
                'text-white': !isDelegateButtonDisabled
              })}
            >
              Delegate
            </Text>
          </Skeleton>
        </Button>
      </div>
      <Modal
        open={isOpen}
        title='Delegate'
        onClose={onClose}
      >
        <DelegateModal
          delegate={delegate}
          onClose={onClose}
          onDelegateConfirmed={onDelegateConfirmed}
        />
      </Modal>
    </Card>
  );
}
