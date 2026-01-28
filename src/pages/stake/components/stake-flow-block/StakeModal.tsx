import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import COMP_AVIF from '@/assets/comp.avif';
import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { AmountInput } from '@/components/ui/AmountInput';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { type Delegate } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useApproveTransaction } from '@/hooks/useApproveTransaction';
import { useBaseTokenAllowance } from '@/hooks/useBaseTokenAllowance';
import { useStakeTransaction } from '@/hooks/useStakeTransaction';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useWalletStore } from '@/stores/useWalletStore';

export type StakeModalProps = {
  onClose?: () => void;
  onStakeConfirmed?: () => void;
};

export function StakeModal(props: StakeModalProps) {
  const { onClose = noop, onStakeConfirmed = noop } = props;

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const { address } = useConnection();

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const {
    data: walletBalance,
    refetch: refetchWalletBalance,
    isLoading: isWalletBalanceLoading
  } = useTokenBalance(address, ENV.BASE_TOKEN_ADDRESS);

  const { data: allowance, refetch: refetchAllowance } = useBaseTokenAllowance(address);

  const { sendTransactionAsync: approve, data: approveHash, isPending: isApprovePending } = useApproveTransaction();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  const { sendTransactionAsync: stake, isPending: isStakePending, isSuccess: isStakeSuccess } = useStakeTransaction();

  const parseAmount = parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS);
  const hasEnoughAllowance = allowance ? allowance >= parseAmount : false;
  const needsApprove = parseAmount > 0n && !hasEnoughAllowance;
  const noAmount = parseAmount === 0n;
  const noDelegate = !selectedAddressDelegate?.address;
  const isAmountExceedsBalance = parseAmount <= (walletBalance ?? 0n);

  /* Loading */
  const isPriceOrBalanceLoading = isBaseTokenPriceLoading || isWalletBalanceLoading;
  const isApproveLoading = isApprovePending || isApproveConfirming;
  const isLoadingTransaction = isApproveLoading || isStakePending;

  /* Disabled */
  const isApproveDisabled = noAmount || !needsApprove || !isAmountExceedsBalance || isApproveLoading;
  const isConfirmDisabled = noAmount || noDelegate || needsApprove || isLoadingTransaction || !isAmountExceedsBalance;

  /* Calculate input value in USD */
  const baseTokenPriceValue = baseTokenPrice ?? 0n;
  const walletBalanceValue = walletBalance ?? 0n;

  const baseTokenPriceFormatted = formatUnits(
    parseAmount * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );
  const walletBalanceFormatted = formatUnits(walletBalanceValue, ENV.BASE_TOKEN_DECIMALS);

  const onMaxButtonClick = () => {
    setAmountValue(walletBalanceFormatted);
  };

  const onDelegateSelect = (address: Delegate | null) => {
    setSelectedAddressDelegate(address);
  };

  const onApprove = async () => {
    if (isApproveDisabled) return;

    await approve({ token: ENV.BASE_TOKEN_ADDRESS, spender: ENV.STAKING_VAULT_ADDRESS, value: parseAmount });
  };

  const onConfirm = async () => {
    if (isConfirmDisabled) return;

    await stake({ amount: parseAmount, delegatee: selectedAddressDelegate?.address });
  };

  useEffect(() => {
    if (isStakeSuccess) {
      onStakeConfirmed();
      onClose();
    }
  }, [isStakeSuccess]);

  useEffect(() => {
    setIsPendingToggle(isLoadingTransaction);
  }, [isLoadingTransaction]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    refetchAllowance();
    refetchWalletBalance();
  }, []);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex flex-col gap-1'>
        <Skeleton loading={isPriceOrBalanceLoading}>
          <div className='flex items-center justify-between'>
            <div className='flex max-w-72 items-center gap-2'>
              <img
                src={COMP_AVIF}
                alt='comp'
                className='size-6.75 shrink-0 rounded-full'
              />
              <AmountInput
                className={cn('min-h-12 max-w-60 min-w-55', {
                  'caret-color-30': isAmountExceedsBalance,
                  'caret-color-31': !isAmountExceedsBalance
                })}
                disabled={isLoadingTransaction}
                value={amountValue}
                onChange={setAmountValue}
              />
            </div>
            <Button
              disabled={isLoadingTransaction}
              className={cn('bg-color-16 h-9 w-[56.24px] text-[11px] font-medium', {
                'bg-color-28': isLoadingTransaction
              })}
              onClick={onMaxButtonClick}
            >
              Max
            </Button>
          </div>
        </Skeleton>
        <div className='flex w-full items-center justify-between'>
          <Skeleton loading={isPriceOrBalanceLoading}>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {Format.price(baseTokenPriceFormatted, 'standard')}
            </Text>
          </Skeleton>
          <Skeleton loading={isPriceOrBalanceLoading}>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {Format.token(walletBalanceFormatted, 'standard', 'COMP')}
            </Text>
          </Skeleton>
        </div>
      </div>
      <Condition if={!isAmountExceedsBalance}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            Amount Exceeds Wallet Balance.
          </Text>
        </div>
      </Condition>
      <Skeleton loading={isPriceOrBalanceLoading}>
        <DelegateSelector
          disabled={isLoadingTransaction}
          selectedAddressDelegate={selectedAddressDelegate}
          onSelect={onDelegateSelect}
        />
      </Skeleton>
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
        <Skeleton loading={isPriceOrBalanceLoading}>
          <Button
            className={cn('h-14 flex-col', {
              'bg-color-7': isApproveLoading
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
                'after-animate-loading-dots text-white': isApproveLoading
              })}
            >
              {isApproveLoading ? 'Pending' : 'Approve'}
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className={cn('text-white', {
                'text-color-6': isApproveDisabled,
                'text-white': isApproveLoading
              })}
            >
              Step 1
            </Text>
          </Button>
        </Skeleton>
        <Skeleton loading={isPriceOrBalanceLoading}>
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
                'after-animate-loading-dots text-white': isStakePending
              })}
            >
              {isStakePending ? 'Pending' : 'Confirm'}
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
        </Skeleton>
      </div>
    </div>
  );
}
