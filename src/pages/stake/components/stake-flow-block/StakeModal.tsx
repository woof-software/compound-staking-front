import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

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
import { useWalletStore } from '@/hooks/useWallet';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';

import COMP from '@/assets/comp.svg';

export function StakeModal() {
  const { onIsPendingToggle } = useWalletStore();

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const { address } = useConnection();

  const { data: baseTokenPrice, isFetching: isBaseTokenPriceFetching } = useTokenPrice(
    ENV.BASE_TOKEN_PRICE_FEED_ADDRESS
  );
  const { data: walletBalance, isFetching: isWalletBalanceFetching } = useTokenBalance(address, ENV.BASE_TOKEN_ADDRESS);

  const isPriceOrBalanceLoading = isBaseTokenPriceFetching || isWalletBalanceFetching;

  const { data: allowance, refetch: refetchAllowance } = useBaseTokenAllowance(address);

  const { sendTransactionAsync: approve, data: approveHash, isPending: isApprovePending } = useApproveTransaction();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  const { sendTransactionAsync: stake, data: stakeHash, isPending: isStakePending } = useStakeTransaction();
  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash
  });

  const parseAmount = parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS);
  const hasEnoughAllowance = allowance ? allowance >= parseAmount : false;
  const needsApprove = parseAmount > 0n && !hasEnoughAllowance;
  const noAmount = parseAmount === 0n;
  const isAmountExceedsBalance = parseAmount <= BigInt(walletBalance ?? 0);

  /* Loading */
  const isApproveLoading = isApprovePending || isApproveConfirming;
  const isStakeLoading = isStakePending || isStakeConfirming;
  const isLoadingTransaction = isApproveLoading || isStakeLoading;

  /* Disabled */
  const isApproveDisabled = noAmount || !needsApprove || !isAmountExceedsBalance;
  const isConfirmDisabled = noAmount || needsApprove || isLoadingTransaction || !isAmountExceedsBalance;

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

    await stake(parseAmount, selectedAddressDelegate?.address);
  };

  useEffect(() => {
    if (isStakeSuccess) {
      setAmountValue('');
      setSelectedAddressDelegate(null);
    }
  }, [isStakeSuccess]);

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
        <Skeleton loading={isPriceOrBalanceLoading}>
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
              {Format.token(walletBalanceFormatted, 'standard')} COMP
            </Text>
          </Skeleton>
        </div>
      </div>
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
                'text-white': isApproveLoading
              })}
            >
              {isApproveLoading ? 'Pending...' : 'Approve'}
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
              'bg-color-7': isStakeLoading
            })}
            disabled={isConfirmDisabled || isStakeLoading}
            onClick={onConfirm}
          >
            <Text
              size='13'
              weight='500'
              lineHeight='18'
              className={cn('text-white', {
                'text-color-6': isConfirmDisabled,
                'text-white': isStakeLoading
              })}
            >
              {isStakeLoading ? 'Pending...' : 'Confirm'}
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className={cn('text-white', {
                'text-color-6': isConfirmDisabled,
                'text-white': isStakeLoading
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
