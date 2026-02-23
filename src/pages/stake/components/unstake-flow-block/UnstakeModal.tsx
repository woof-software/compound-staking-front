import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useApproveTransaction } from '@/hooks/useApproveTransaction';
import { useUnstakeLockDuration } from '@/hooks/useLockDuration';
import { useStakedTokenAllowance } from '@/hooks/useStakedTokenAllowance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVestingPerUser } from '@/hooks/useVestingPerUser';
import { cn } from '@/lib/utils/cn';
import { Format, FormatTime } from '@/lib/utils/format';
import { getAddressContracts } from '@/lib/utils/helpers';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useUnstakeRequest } from '@/pages/stake/hooks/useUnstakeRequest';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';

export function UnstakeModal() {
  const { address, isConnected, chainId } = useConnection();

  const { mutateAsync: switchChainAsync } = useSwitchChain();

  const { lockManagerAddress } = getAddressContracts(APPLICATION_CHAIN);

  const { data: lockDuration } = useUnstakeLockDuration(APPLICATION_CHAIN, lockManagerAddress);

  const { data: stakedTokenBalance } = useStakedBalance(APPLICATION_CHAIN, address);

  const { data: stakedTokenPriceUsdData } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: maxVestingPositions } = useVestingPerUser(APPLICATION_CHAIN);

  const { data: vestingPositions = [], isLoading: isVestingPositionsLoading } = useVestingPosition(
    APPLICATION_CHAIN,
    address
  );

  const {
    data: allowance,
    isPending: isAllowanceLoading,
    refetch: refetchAllowance
  } = useStakedTokenAllowance(APPLICATION_CHAIN, address);

  const {
    sendTransactionAsync: approve,
    data: approveTransactionHash,
    isPending: isApproveTransactionPending
  } = useApproveTransaction();

  const { isLoading: isApproveTransactionMining, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveTransactionHash
  });

  const {
    data: unstakeTransactionHash,
    isPending: isUnstakeTransactionConfirming,
    sendTransactionAsync: unstake
  } = useUnstakeRequest(APPLICATION_CHAIN);

  const { isLoading: isUnstakeTransactionMining } = useWaitForTransactionReceipt({
    hash: unstakeTransactionHash
  });

  useEffect(() => {
    if (!isApproveSuccess) return;

    refetchAllowance();
  }, [isApproveSuccess]);

  const baseTokenPriceFormatted = formatUnits(
    (stakedTokenBalance?.principal ?? 0n) * (stakedTokenPriceUsdData ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const isWrongNetwork = isConnected && !!chainId && chainId !== APPLICATION_CHAIN;

  const hasAtLeastOnePosition = !!vestingPositions?.length;
  const hasReachedPositionsLimit =
    hasAtLeastOnePosition && vestingPositions?.length === Number(maxVestingPositions ?? 0n);

  const isAllowanceEnough = (allowance ?? -1n) >= (stakedTokenBalance?.principal ?? 0n);

  const isApproveButtonLoading = (() => {
    // Must show loading during transaction confirmation and mining
    if (isApproveTransactionPending) return true;
    if (isApproveTransactionMining) return true;
  })();

  const isApproveButtonDisabled = (() => {
    // Should be disabled until getting know if the user may create more positions
    if (isVestingPositionsLoading) return true;

    // Must be disabled if the user has the wrong network selected
    if (isWrongNetwork) return true;

    // Must be disabled if allowance is enough
    if (isAllowanceEnough) return true;

    // Must show loading during allowance check
    if (isAllowanceLoading) return true;

    // Must show loading during transaction confirmation and mining
    if (isApproveTransactionPending) return true;
    if (isApproveTransactionMining) return true;
  })();

  const isUnstakeButtonLoading = (() => {
    // Must show loading if transaction in progress
    if (isUnstakeTransactionConfirming) return true;
    if (isUnstakeTransactionMining) return true;
  })();

  const isUnstakeButtonDisabled = (() => {
    // Should be disabled until getting know if the user may create more positions
    if (isVestingPositionsLoading) return true;

    // Must be disabled if the user has the wrong network selected
    if (isWrongNetwork) return true;

    // Must be disabled if allowance is not enough
    if (!isAllowanceEnough) return true;

    // Must be disabled during allowance check
    if (isAllowanceLoading) return true;

    // Must be disabled if transaction in progress
    if (isUnstakeTransactionConfirming) return true;
    if (isUnstakeTransactionMining) return true;
  })();

  const onUnstake = async () => {
    if (isWrongNetwork) {
      await switchChainAsync({ chainId: APPLICATION_CHAIN });
    }

    if (isUnstakeButtonDisabled) return;

    await unstake();
  };

  const onApprove = async () => {
    if (isWrongNetwork) {
      await switchChainAsync({ chainId: APPLICATION_CHAIN });
    }

    if (isApproveButtonDisabled) return;

    const { stakedTokenAddress, stakingVaultAddress } = getAddressContracts(APPLICATION_CHAIN);

    if (!stakedTokenAddress || !stakingVaultAddress || !stakedTokenBalance) return;

    await approve({
      token: stakedTokenAddress,
      spender: stakingVaultAddress,
      value: stakedTokenBalance.principal
    });
  };

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex justify-between'>
        <Text
          size='15'
          lineHeight='20'
        >
          Unstaked amount
        </Text>
        <div className='flex flex-col items-end'>
          <Text
            size='15'
            weight='500'
            lineHeight='20'
          >
            {Format.token(formatUnits(stakedTokenBalance?.principal ?? 0n, ENV.BASE_TOKEN_DECIMALS), {
              symbol: 'COMP'
            })}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            {Format.price(baseTokenPriceFormatted, 'standard')}
          </Text>
        </div>
      </div>
      <div className='flex justify-between'>
        <Text
          size='15'
          lineHeight='20'
        >
          Cooldown
        </Text>
        <Text
          size='15'
          weight='500'
          lineHeight='20'
        >
          {FormatTime.cooldownFromSeconds(Number(lockDuration ?? 0n))}
        </Text>
      </div>
      <Condition if={hasReachedPositionsLimit}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4 shrink-0' />
          <Text
            size='11'
            lineHeight='16'
            weight='500'
            className='text-color-22'
          >
            Maximum vesting limit reached ({maxVestingPositions}). Close completed entries or wait for active ones to
            finish
          </Text>
        </div>
      </Condition>
      <Condition if={!hasReachedPositionsLimit}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4 shrink-0' />
          <div>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              All staked COMP will be unstaked
            </Text>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              All accrued rewards will be vested
            </Text>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              A portion of unvested rewards will be forfeited
            </Text>
          </div>
        </div>
      </Condition>
      <div className='flex flex-col gap-2.5'>
        <Button
          className={cn('h-14 flex-col', {
            'bg-color-7': isApproveButtonLoading
          })}
          disabled={isApproveButtonDisabled}
          onClick={onApprove}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isApproveButtonDisabled,
              'after-animate-loading-dots text-white': isApproveButtonLoading
            })}
          >
            {isApproveButtonLoading ? 'Approving' : 'Approve'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isApproveButtonDisabled,
              'text-white': isApproveButtonLoading
            })}
          >
            Step 1
          </Text>
        </Button>
        <Button
          disabled={isUnstakeButtonDisabled}
          className={cn('h-14 flex-col', {
            'bg-color-7': isUnstakeButtonLoading
          })}
          onClick={onUnstake}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isUnstakeButtonDisabled,
              'after-animate-loading-dots text-white': isUnstakeButtonLoading
            })}
          >
            {isUnstakeButtonLoading ? 'Pending' : 'Confirm'}
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className={cn('text-white', {
              'text-color-6': isUnstakeButtonDisabled,
              'text-white': isUnstakeButtonLoading
            })}
          >
            Step 2
          </Text>
        </Button>
      </div>
    </div>
  );
}
