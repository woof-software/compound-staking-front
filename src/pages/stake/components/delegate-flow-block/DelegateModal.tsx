import { useEffect, useEffectEvent, useState } from 'react';
import type { Address } from 'viem';
import { useConnection } from 'wagmi';

import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { type Delegate } from '@/consts/common';
import { useDelegateTransaction } from '@/hooks/useDelegateTransaction';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { useWalletStore } from '@/stores/useWalletStore';

export type DelegateModalProps = {
  subAccountAddress?: Address | undefined;
  delegate?: Delegate | undefined;
  onClose?: () => void;
  onDelegateConfirmed?: () => void;
};

export function DelegateModal(props: DelegateModalProps) {
  const { delegate, subAccountAddress, onClose = noop, onDelegateConfirmed = noop } = props;

  const { chainId } = useConnection();

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const {
    sendTransactionAsync: delegateTransaction,
    isPending: isDelegatePending,
    isSuccess: isDelegateSuccess
  } = useDelegateTransaction(chainId, subAccountAddress);

  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(() => delegate ?? null);

  const isConfirmDisabled = !selectedAddressDelegate || selectedAddressDelegate.address === delegate?.address;

  const onDelegateSelect = (addressDelegate: Delegate | null) => {
    setSelectedAddressDelegate(addressDelegate);
  };

  const onConfirm = async () => {
    if (!selectedAddressDelegate || !subAccountAddress) return;

    setIsPendingToggle(true);
    await delegateTransaction(selectedAddressDelegate.address);
  };

  const onDelegateSuccess = useEffectEvent(() => {
    setIsPendingToggle(false);
    onClose();
    onDelegateConfirmed();
  });

  useEffect(() => {
    setSelectedAddressDelegate(delegate ?? null);
  }, [delegate]);

  useEffect(() => {
    if (!isDelegateSuccess) return;

    onDelegateSuccess();
  }, [isDelegateSuccess]);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <DelegateSelector
        disabled={isDelegatePending}
        selectedAddressDelegate={selectedAddressDelegate}
        onSelect={onDelegateSelect}
      />
      <Button
        className={cn('h-14 flex-col', {
          'bg-color-7': isDelegatePending
        })}
        disabled={isConfirmDisabled || isDelegatePending}
        onClick={onConfirm}
      >
        <Text
          size='13'
          weight='500'
          lineHeight='18'
          className={cn('text-white', {
            'text-color-6': isConfirmDisabled,
            'after-animate-loading-dots text-white': isDelegatePending
          })}
        >
          {isDelegatePending ? 'Pending' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
