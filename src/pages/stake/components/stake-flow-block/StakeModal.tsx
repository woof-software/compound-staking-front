import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection } from 'wagmi';

import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { AmountInput } from '@/components/ui/AmountInput';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { type Delegate } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useTokenAllowance } from '@/hooks/useTokenAllowance';
import { useTokenApprove } from '@/hooks/useTokenApprove';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useTokenStake } from '@/hooks/useTokenStake';
import { useWalletStore } from '@/hooks/useWallet';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';

import COMP from '@/assets/comp.svg';

export type StakeModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function StakeModal(props: StakeModalProps) {
  const { onClose = noop } = props;

  const { onIsPendingToggle } = useWalletStore();

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const { address } = useConnection();

  const { data: compPriceUsdData } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);
  const { data: compWalletBalanceData } = useTokenBalance(address, ENV.BASE_TOKEN_ADDRESS);

  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(
    ENV.BASE_TOKEN_ADDRESS,
    address,
    ENV.STAKING_VAULT_ADDRESS
  );

  const { approve, isPending: isApprovePending, isApproveSuccess } = useTokenApprove();
  const { stake, isPending: isStakePending, isStakeSuccess } = useTokenStake();

  const parsedAmount = Number(amountValue) > 0 ? parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS) : 0n;

  const hasEnoughAllowance = allowance ? allowance >= parsedAmount : false;

  const needsApprove = parsedAmount > 0n && !hasEnoughAllowance;

  const noDelegate = !selectedAddressDelegate?.address;
  const noAmount = parsedAmount === 0n;

  const isLoadingTransaction = isApprovePending || isStakePending;

  const isApproveDisabled = noDelegate || noAmount || !needsApprove;
  const isConfirmDisabled = noDelegate || noAmount || needsApprove || isLoadingTransaction;

  // Calculate input value in USD
  const compPriceUsdValue = compPriceUsdData ?? 0n;
  const compWalletBalanceValue = compWalletBalanceData ?? 0n;

  const parseAmountValue = parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS);

  const inputValueInCOMP = formatUnits(
    parseAmountValue * compPriceUsdValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );
  const compWalletBalance = formatUnits(compWalletBalanceValue, ENV.BASE_TOKEN_DECIMALS);

  const onMaxButtonClick = () => {
    setAmountValue(compWalletBalance);
  };

  const onDelegateSelect = (address: Delegate | null) => {
    setSelectedAddressDelegate(address);
  };

  const onApprove = async () => {
    if (noAmount || !needsApprove) return;

    await approve(amountValue);

    await refetchAllowance();
  };

  const onConfirm = async () => {
    const delegateAddress = selectedAddressDelegate?.address;

    if (!delegateAddress || noAmount || isStakePending) return;

    await stake(delegateAddress, amountValue);
  };

  if (isStakeSuccess) {
    onClose();
  }

  useEffect(() => {
    onIsPendingToggle(isLoadingTransaction);
  }, [isLoadingTransaction]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess]);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-5'>
          <div className='flex max-w-72 items-center gap-2'>
            <COMP className='size-6.75 shrink-0' />
            <AmountInput
              className='min-h-12 max-w-60'
              disabled={isLoadingTransaction}
              value={amountValue}
              onChange={setAmountValue}
            />
          </div>
          <Button
            disabled={isLoadingTransaction}
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
            {Format.price(inputValueInCOMP, 'standard')}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            {Format.token(compWalletBalance, 'standard')} COMP
          </Text>
        </div>
      </div>
      <DelegateSelector
        disabled={isLoadingTransaction}
        selectedAddressDelegate={selectedAddressDelegate}
        onSelect={onDelegateSelect}
      />
      {/*TODO: add warning for additional stake */}
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
              'text-color-6': isApproveDisabled,
              'text-white': isApprovePending
            })}
          >
            {isApprovePending ? 'Pending...' : 'Approve'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isApproveDisabled,
              'text-white': isApprovePending
            })}
          >
            Step 1
          </Text>
        </Button>
        <Button
          className={cn('h-14 flex-col', {
            'bg-color-7': isStakePending
          })}
          disabled={isConfirmDisabled || isStakePending}
          onClick={onConfirm}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isConfirmDisabled,
              'text-white': isStakePending
            })}
          >
            {isStakePending ? 'Pending...' : 'Confirm'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isConfirmDisabled,
              'text-white': isStakePending
            })}
          >
            Step 2
          </Text>
        </Button>
      </div>
    </div>
  );
}
