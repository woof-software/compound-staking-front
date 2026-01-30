import { useEffect, useEffectEvent, useState } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
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
import { APPLICATION_CHAIN, type Delegate } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useApproveTransaction } from '@/hooks/useApproveTransaction';
import { useBaseTokenAllowance } from '@/hooks/useBaseTokenAllowance';
import { useIncreaseStakeTransaction } from '@/hooks/useIncreaseStakeTransaction';
import { useStakeTransaction } from '@/hooks/useStakeTransaction';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVestingPerUser } from '@/hooks/useVestingPerUser';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { getAddressContracts, getDelegateByAddress } from '@/lib/utils/helpers';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';
import { useWalletStore } from '@/stores/useWalletStore';

export type StakeModalProps = {
  delegateAddress?: Address | undefined;
  stakedBalance?: bigint | undefined;
  onStakeConfirmed?: () => void;
};

export function StakeModal(props: StakeModalProps) {
  const { stakedBalance, delegateAddress, onStakeConfirmed = noop } = props;

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const { address, chainId } = useConnection();

  const { baseTokenAddress, stakingVaultAddress } = getAddressContracts(chainId);

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const {
    data: walletBalance,
    refetch: refetchWalletBalance,
    isLoading: isWalletBalanceLoading
  } = useTokenBalance(address, baseTokenAddress);

  const { data: maxVestingPositions } = useVestingPerUser(APPLICATION_CHAIN);

  const { data: vestingPositions = [], isLoading: isVestingPositionsLoading } = useVestingPosition(
    APPLICATION_CHAIN,
    address
  );

  const { data: allowance, refetch: refetchAllowance } = useBaseTokenAllowance(APPLICATION_CHAIN, address);

  const { sendTransactionAsync: approve, data: approveHash, isPending: isApprovePending } = useApproveTransaction();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  const { data: stakeHash, sendTransactionAsync: stake, isPending: isStakePending } = useStakeTransaction(chainId);

  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash
  });

  const {
    data: increaseStakeHash,
    sendTransactionAsync: increaseStake,
    isPending: isIncreaseStakePending
  } = useIncreaseStakeTransaction(chainId);

  const { isLoading: isIncreaseStakeConfirming, isSuccess: isIncreaseStakeSuccess } = useWaitForTransactionReceipt({
    hash: increaseStakeHash
  });

  const parseAmount = parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS);
  const hasEnoughAllowance = allowance ? allowance >= parseAmount : false;
  const needsApprove = parseAmount > 0n && !hasEnoughAllowance;
  const noAmount = parseAmount === 0n;
  const noDelegate = !selectedAddressDelegate?.address;
  const isAmountExceedsBalance = parseAmount <= (walletBalance ?? 0n);

  const showWarningForAdditionalStake = (stakedBalance ?? 0n) > 0n;
  const hasPosition = !!vestingPositions?.length;
  const hasMaxPosition = hasPosition ? vestingPositions?.length === Number(maxVestingPositions ?? 0n) : false;

  /* Loading */
  const isPriceOrBalanceLoading = isBaseTokenPriceLoading || isWalletBalanceLoading;
  const isApproveLoading = isApprovePending || isApproveConfirming;
  const isStakeLoading = isStakePending || isStakeConfirming || isIncreaseStakePending || isIncreaseStakeConfirming;
  const isLoadingTransaction = isApproveLoading || isStakeLoading || isIncreaseStakePending;

  /* Disabled */
  const isApproveDisabled =
    noAmount ||
    !needsApprove ||
    !isAmountExceedsBalance ||
    isApproveLoading ||
    isVestingPositionsLoading ||
    hasMaxPosition;

  const isConfirmDisabled =
    noAmount ||
    noDelegate ||
    needsApprove ||
    isLoadingTransaction ||
    !isAmountExceedsBalance ||
    isVestingPositionsLoading ||
    hasMaxPosition;

  /* Success */
  const isStakeSuccessConfirmed = isStakeSuccess || isIncreaseStakeSuccess;

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
    if (isApproveDisabled || !baseTokenAddress || !stakingVaultAddress) return;

    await approve({ token: baseTokenAddress, spender: stakingVaultAddress, value: parseAmount });
  };

  const refetchData = useEffectEvent(async () => {
    refetchWalletBalance();
    refetchAllowance();

    onStakeConfirmed();
  });

  const onConfirm = async () => {
    if (isConfirmDisabled) return;

    if (!showWarningForAdditionalStake) {
      await stake({ amount: parseAmount, delegatee: selectedAddressDelegate?.address });
    } else {
      await increaseStake({ amount: parseAmount, delegatee: selectedAddressDelegate?.address });
    }
  };

  useEffect(() => {
    if (selectedAddressDelegate?.address) return;

    if (!delegateAddress) return;

    const delegate = getDelegateByAddress(delegateAddress) ?? null;

    setSelectedAddressDelegate(delegate);
  }, [delegateAddress, selectedAddressDelegate?.address]);

  useEffect(() => {
    if (!isStakeSuccessConfirmed) return;

    refetchData();
  }, [isStakeSuccessConfirmed]);

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
                disabled={isLoadingTransaction || hasMaxPosition}
                value={amountValue}
                onChange={setAmountValue}
              />
            </div>
            <Button
              disabled={isLoadingTransaction || hasMaxPosition}
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
          <InfoIcon className='text-color-31 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-31'
          >
            Amount Exceeds Wallet Balance.
          </Text>
        </div>
      </Condition>
      <Skeleton loading={isPriceOrBalanceLoading}>
        <DelegateSelector
          disabled={isLoadingTransaction || hasMaxPosition}
          selectedAddressDelegate={selectedAddressDelegate}
          onSelect={onDelegateSelect}
        />
      </Skeleton>
      <Condition if={hasMaxPosition}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4 shrink-0' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            You have reached the maximum limit ({maxVestingPositions}) for Vesting entries. You need to close completed
            entries or wait until they are finished.
          </Text>
        </div>
      </Condition>
      <Condition if={!hasMaxPosition && showWarningForAdditionalStake}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4' />
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
              'bg-color-7': isStakeLoading
            })}
            disabled={isConfirmDisabled}
            onClick={onConfirm}
          >
            <Text
              size='13'
              weight='500'
              lineHeight='18'
              className={cn('text-white', {
                'text-color-6': isConfirmDisabled,
                'after-animate-loading-dots text-white': isStakeLoading
              })}
            >
              {isStakeLoading ? 'Pending' : 'Confirm'}
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
