import { useEffect, useState } from 'react';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { type Delegate } from '@/consts/common';
import { useDelegateSubAccount } from '@/hooks/useDelegateSubAccount';
import { useDelegateTransaction } from '@/hooks/useDelegateTransaction';
import { useWalletStore } from '@/hooks/useWallet';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';

export type DelegateModalProps = {
  delegate?: Delegate | undefined;
  onClose?: () => void;
  onDelegateConfirmed?: () => void;
};

export function DelegateModal(props: DelegateModalProps) {
  const { delegate, onClose = noop, onDelegateConfirmed = noop } = props;

  const { address } = useConnection();

  const { data: subAccountAddress, isLoading: isSubAccountLoading } = useDelegateSubAccount(address);

  const { setIsPendingToggle } = useWalletStore();

  const {
    sendTransactionAsync: delegateTransaction,
    data: delegateHash,
    isPending: isDelegatePending
  } = useDelegateTransaction();

  const { isLoading: isDelegateConfirming, isSuccess: isDelegateSuccess } = useWaitForTransactionReceipt({
    hash: delegateHash
  });

  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const isConfirmDisabled = selectedAddressDelegate?.address === delegate?.address;

  const isDelegateLoading = isDelegatePending || isDelegateConfirming || isSubAccountLoading;

  const onDelegateSelect = (addressDelegate: Delegate | null) => {
    setSelectedAddressDelegate(addressDelegate);
  };

  const onConfirm = async () => {
    if (!selectedAddressDelegate || !subAccountAddress) return;

    setIsPendingToggle(true);

    await delegateTransaction({ subAddress: subAccountAddress, delegate: selectedAddressDelegate.address });
  };

  useEffect(() => {
    setSelectedAddressDelegate(delegate ?? null);
  }, [delegate]);

  useEffect(() => {
    if (!isDelegateSuccess) return;

    setIsPendingToggle(false);
    onClose();
    onDelegateConfirmed();
  }, [isDelegateSuccess]);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <DelegateSelector
        disabled={isDelegateLoading}
        selectedAddressDelegate={selectedAddressDelegate}
        onSelect={onDelegateSelect}
      />
      <Button
        className={cn('h-14 flex-col', {
          'bg-color-7': isDelegateLoading
        })}
        disabled={isConfirmDisabled || isDelegateLoading}
        onClick={onConfirm}
      >
        <Text
          size='13'
          weight='500'
          lineHeight='18'
          className={cn('text-white', {
            'text-color-6': isConfirmDisabled,
            'text-white': isDelegateLoading
          })}
        >
          {isDelegateLoading ? 'Pending...' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
