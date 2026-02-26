import { useEffect, useEffectEvent, useState } from 'react';
import type { Address } from 'viem';
import { useConnection, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

import { DesktopDelegateSelector } from '@/components/common/stake/DelegateSelector/DesktopDelegateSelector';
import { MobileDelegateSelector } from '@/components/common/stake/DelegateSelector/MobileDelegateSelector';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN, type Delegate } from '@/consts/common';
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

  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(() => delegate ?? null);

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const { isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending } = useSwitchChain();

  const {
    data: delegateHash,
    sendTransactionAsync: delegateTransaction,
    isPending: isDelegatePending
  } = useDelegateTransaction(APPLICATION_CHAIN, subAccountAddress);

  const { isLoading: isDelegateConfirming, isSuccess: isDelegateSuccess } = useWaitForTransactionReceipt({
    hash: delegateHash
  });

  const isDelegateLoading = isPending || isDelegatePending || isDelegateConfirming;

  const isConfirmDisabled = !selectedAddressDelegate || selectedAddressDelegate.address === delegate?.address;

  const isWrongNetwork = isConnected && !!chainId && chainId !== APPLICATION_CHAIN;

  const onDelegateSelect = (addressDelegate: Delegate | null) => {
    setSelectedAddressDelegate(addressDelegate);
  };

  const onConfirm = async () => {
    if (!selectedAddressDelegate || !subAccountAddress) return;

    if (isWrongNetwork) {
      await switchChainAsync({ chainId: APPLICATION_CHAIN });
    }

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
      <DesktopDelegateSelector
        disabled={isDelegateLoading}
        selectedAddressDelegate={selectedAddressDelegate}
        onSelect={onDelegateSelect}
      />
      <MobileDelegateSelector
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
            'after-animate-loading-dots text-white': isDelegateLoading
          })}
        >
          {isDelegateLoading ? 'Pending' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
