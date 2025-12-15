import { useEffect, useState } from 'react';
import { type Address, parseUnits } from 'viem';

import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { AmountInput } from '@/components/ui/AmountInput';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { BASE_TOKEN_DECIMALS } from '@/consts/common';
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

    allowance
  } = useStakeTransaction();

  const parsedAmount = Number(amountValue) > 0 ? parseUnits(amountValue, BASE_TOKEN_DECIMALS) : 0n;

  const hasEnoughAllowance = allowance >= parsedAmount;
  const needsApprove = parsedAmount > 0n && !hasEnoughAllowance;

  const noDelegate = !selectedAddressDelegate?.address;
  const noAmount = parsedAmount === 0n;

  const isApproveDisabled = noDelegate || noAmount || !needsApprove || isApproveSuccess;

  const isConfirmDisabled = noDelegate || noAmount || (needsApprove && !isApproveSuccess);

  const disabledInputAndSelector = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming;

  // Calculate input value in USD
  const inputValueInCOMP = Number(amountValue) * compPriceUsd;
  const balance = Format.price(inputValueInCOMP, 'standard');

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
    if (noAmount || !needsApprove) return;

    await approve(amountValue);
  };

  const onConfirm = async () => {
    if (noDelegate || noAmount || isStakePending || isStakeConfirming) return;

    await stake(selectedAddressDelegate?.address, amountValue);
  };

  useEffect(() => {
    if (isStakeSuccess) {
      onClose();
    }
  }, [isStakeSuccess, onClose]);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-5'>
          <div className='flex max-w-72 items-center gap-2'>
            <COMP className='size-6.75 shrink-0' />
            <AmountInput
              className='min-h-12 max-w-60'
              disabled={disabledInputAndSelector}
              value={amountValue}
              onChange={onInputChange}
            />
          </div>
          <Button
            disabled={disabledInputAndSelector}
            className='bg-color-16 h-8 w-14 text-[11px] font-medium'
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
      {/*<Condition if={showWarningForAdditionalStake}>*/}
      {/*  <div className='bg-color-21 rounded-lg p-5 flex items-center gap-2.5'>*/}
      {/*    <InfoIcon className='size-4 text-color-22' />*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      lineHeight='16'*/}
      {/*      className='text-color-22'*/}
      {/*    >*/}
      {/*      Multiplier reverts to 1x after staking more COMP. All available rewards get vested.*/}
      {/*    </Text>*/}
      {/*  </div>*/}
      {/*</Condition>*/}
      <div className='flex flex-col gap-2.5'>
        <Button
          className={cn('h-14 flex-col', {
            'bg-color-7': isApprovePending
          })}
          disabled={isApproveDisabled}
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
          className={cn('h-14 flex-col', {
            'bg-color-7': isStakePending
          })}
          disabled={isConfirmDisabled || isStakePending || isStakeConfirming}
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
