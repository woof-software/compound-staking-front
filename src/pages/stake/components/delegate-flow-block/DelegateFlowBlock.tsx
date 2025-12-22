import { useMemo } from 'react';
import { useConnection } from 'wagmi';

import { ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { DELEGATES } from '@/consts/common';
import { useDelegateDuration } from '@/hooks/useDelegateDuration';
import { useDelegateSubAccount } from '@/hooks/useDelegateSubAccount';
import { useSubAccount } from '@/hooks/useSubAccount';
import { cn } from '@/lib/utils/cn';
import { getExplorerAddressUrl } from '@/lib/utils/helpers';

export function DelegateFlowBlock() {
  const { isConnected } = useConnection();

  const { address } = useConnection();

  const { data: delegateDuration, isLoading: isDurationLoading } = useDelegateDuration();
  const { data: subAccountAddress, isLoading: isSubAccountLoading } = useDelegateSubAccount(address);
  const { data: delegateData, isLoading: isDelegateLoading } = useSubAccount(subAccountAddress);

  const isLoading = isDurationLoading || isSubAccountLoading || isDelegateLoading;

  const isDelegateButtonDisabled = !isConnected || isLoading;

  const delegate = useMemo(() => {
    const target = DELEGATES.find(
      (delegate) => delegate.address.toLowerCase() === delegateData?.delegatee?.toLowerCase()
    );

    if (!target) {
      return {
        name: delegateData?.delegatee,
        address: delegateData?.delegatee
      };
    }

    return target;
  }, [delegateData]);

  console.log('delegateDuration=>', delegateDuration);
  console.log('subAccountAddress=>', subAccountAddress);
  console.log('delegateData=>', delegateData);
  console.log('delegate=>', delegate);

  return (
    <Card
      title='Delegation'
      tooltip='Cooldown period for redelegation process is 01d 00h 00m 00s'
    >
      <div className='flex justify-between p-10'>
        <div className='flex gap-15'>
          <div className='flex flex-col gap-3'>
            <Skeleton loading={isLoading}>
              <Text
                size='11'
                className='text-color-24'
              >
                Wallet address of Delegatee
              </Text>
            </Skeleton>
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
                    'text-color-6': !isConnected
                  })}
                >
                  {isConnected ? delegate?.name : '-'}
                </Text>
                <Condition if={isConnected}>
                  <ExternalLinkIcon className='text-color-24' />
                </Condition>
              </a>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Skeleton loading={isLoading}>
              <Text
                size='11'
                className='text-color-24'
              >
                Cooldown
              </Text>
            </Skeleton>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? '00d 00h' : '-'}
              </Text>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Skeleton loading={isLoading}>
              <Text
                size='11'
                className='text-color-24'
              >
                End Date
              </Text>
            </Skeleton>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? 'July 24, 2025' : '-'}
              </Text>
            </Skeleton>
          </div>
        </div>
        <Button
          disabled={isDelegateButtonDisabled}
          className='max-w-32.5 text-[11px] font-medium'
        >
          Delegate
        </Button>
      </div>
    </Card>
  );
}
