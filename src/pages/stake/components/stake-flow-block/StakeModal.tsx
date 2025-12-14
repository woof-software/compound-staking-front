import { useEffect, useState } from 'react';
import type { Address } from 'viem';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { AmountInput } from '@/components/ui/AmountInput';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { useCompBalance } from '@/hooks/useCOMPBalance';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { useStakeTransaction } from '@/pages/stake/hooks/useStakeTransaction';

import COMP from '@/assets/comp.svg';

type StakeModalProps = {
  onClose: () => void;
};

export function StakeModal(props: StakeModalProps) {
  const { onClose } = props;

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<{ name: string; address: Address } | null>(
    null
  );

  const { compPriceUsd, compWalletBalance } = useCompBalance();

  const {
    isApproveSuccess,
    isApprovePending,
    isApproveConfirming,
    approve,

    isStakeSuccess,
    isStakePending,
    isStakeConfirming,
    stake,

    stakedCOMPBalance
  } = useStakeTransaction();

  const inputValueInCOMP = Number(amountValue) * compPriceUsd;
  const balance = Format.price(inputValueInCOMP, 'standard');

  const showWarningForAdditionalStake = (stakedCOMPBalance as bigint) > 0n;

  const isApproveDisabled = !selectedAddressDelegate?.address || Number(amountValue) === 0 || isApproveSuccess;
  const isConfirmDisabled = !isApproveSuccess;

  const disabledInputAndSelector = isApprovePending || isApproveConfirming || isApproveSuccess;

  const onInputChange = (value: string) => {
    setAmountValue(value);
  };

  const onMaxButtonClick = () => {
    setAmountValue(compWalletBalance.toString());
  };

  const onDelegateSelect = (address: { name: string; address: Address } | null) => {
    setSelectedAddressDelegate(address);
  };

  const onApprove = async () => {
    await approve(amountValue);
  };

  const onConfirm = async () => {
    if (!selectedAddressDelegate?.address) return;

    await stake(selectedAddressDelegate?.address, amountValue);
  };

  useEffect(() => {
    if (isStakeSuccess) {
      onClose();
    }
  }, [isStakeSuccess, onClose]);

  return (
    <div className='mt-8 w-full flex flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-5'>
          <div className='flex items-center gap-2 max-w-72'>
            <COMP className='size-6.75 shrink-0' />
            <AmountInput
              className='max-w-60 min-h-12'
              disabled={disabledInputAndSelector}
              value={amountValue}
              onChange={onInputChange}
            />
          </div>
          <Button
            disabled={disabledInputAndSelector}
            className='bg-color-16 h-8 text-[11px] font-medium w-14'
            onClick={onMaxButtonClick}
          >
            Max
          </Button>
        </div>
        <div className='flex w-full items-center justify-between'>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            {balance}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            {compWalletBalance} COMP
          </Text>
        </div>
      </div>
      <DelegateSelector
        disabled={disabledInputAndSelector}
        selectedAddressDelegate={selectedAddressDelegate}
        onSelect={onDelegateSelect}
      />
      <Condition if={showWarningForAdditionalStake}>
        <div className='bg-color-21 rounded-lg p-5 flex items-center gap-2.5'>
          <InfoIcon className='size-4 text-color-22' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            Multiplier reverts to 1x after staking more COMP. All available rewards get vested.
          </Text>
        </div>
      </Condition>
      <div className='flex flex-col gap-2.5'>
        <Button
          className={cn('flex-col h-14', {
            'bg-color-7': isApprovePending
          })}
          disabled={isApproveDisabled || isApprovePending}
          onClick={onApprove}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isApproveDisabled
            })}
          >
            {isApproveConfirming || isApprovePending ? 'Pending...' : 'Approve'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isApproveDisabled
            })}
          >
            Step 1
          </Text>
        </Button>
        <Button
          className={cn('flex-col h-14')}
          disabled={isConfirmDisabled}
          onClick={onConfirm}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isConfirmDisabled
            })}
          >
            {isStakeConfirming || isStakePending ? 'Pending...' : 'Confirm'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isConfirmDisabled
            })}
          >
            Step 2
          </Text>
        </Button>
      </div>
    </div>
  );
}
