import { useEffect, useEffectEvent } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVestingPerUser } from '@/hooks/useVestingPerUser';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';
import { useVestRewards } from '@/pages/stake/hooks/useVestRewards';
import { useWalletStore } from '@/stores/useWalletStore';

export type VestingModalProps = {
  onVestingConfirmed?: () => void;
};

export function VestingModal({ onVestingConfirmed = noop }: VestingModalProps) {
  const { address, isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending: isSwitchPending } = useSwitchChain();

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: availableRewards, isLoading: isAvailableRewardsLoading } = useAvailableRewards(
    APPLICATION_CHAIN,
    address
  );

  const { data: maxVestingPositions } = useVestingPerUser(APPLICATION_CHAIN);

  const { data: vestingPositions = [], isLoading: isVestingPositionsLoading } = useVestingPosition(
    APPLICATION_CHAIN,
    address
  );

  const {
    data: vestRewardsHash,
    sendTransactionAsync: vestRewardsRequest,
    isPending: isVestRewardsPending
  } = useVestRewards(APPLICATION_CHAIN);

  const { isLoading: isVestRewardsConfirming, isSuccess: isVestRewardsSuccess } = useWaitForTransactionReceipt({
    hash: vestRewardsHash
  });

  const baseTokenPriceValue = baseTokenPrice ?? 0n;
  const availableRewardsPriceFormatted = formatUnits(
    (availableRewards ?? 0n) * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const availableRewardsFormatted = formatUnits(availableRewards ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

  const hasPosition = !!vestingPositions?.length;
  const hasMaxPosition = hasPosition ? vestingPositions?.length === Number(maxVestingPositions ?? 0n) : false;

  const isVestingLoading =
    isSwitchPending || isVestingPositionsLoading || isVestRewardsConfirming || isVestRewardsPending;
  const isLoading = isConnected ? isAvailableRewardsLoading || isBaseTokenPriceLoading : false;

  const isVestButtonDisabled = isLoading || isVestingLoading || hasMaxPosition;

  const isWrongNetwork = isConnected && !!chainId && chainId !== APPLICATION_CHAIN;

  const onConfirm = async () => {
    if (!address) return;

    if (isWrongNetwork) {
      await switchChainAsync({ chainId: APPLICATION_CHAIN });
    }

    await vestRewardsRequest();
  };

  const onVestRewardsSuccess = useEffectEvent(() => {
    setIsPendingToggle(false);
    onVestingConfirmed();
  });

  useEffect(() => {
    if (!isVestRewardsSuccess) return;

    onVestRewardsSuccess();
  }, [isVestRewardsSuccess]);

  return (
    <div className='mt-8 flex flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex'>
        <Text
          size='15'
          lineHeight='20'
          className='w-full'
        >
          Amount to vest
        </Text>
        <div className='flex shrink-0 flex-col items-end'>
          <div className='flex shrink-0 items-end'>
            <Skeleton loading={isLoading}>
              <div className='flex gap-1'>
                <Condition if={availableRewards}>
                  <Text
                    size='15'
                    weight='500'
                    lineHeight='20'
                    className={cn('text-color-2', {
                      'text-color-6': !isConnected
                    })}
                  >
                    ≈
                  </Text>
                </Condition>
                <Text
                  size='15'
                  weight='500'
                  lineHeight='20'
                  className={cn('text-color-2', {
                    'text-color-6': !isConnected
                  })}
                >
                  {Format.token(availableRewardsFormatted, { symbol: 'COMP' })}
                </Text>
              </div>
            </Skeleton>
          </div>
          <Condition if={isConnected}>
            <Skeleton loading={isLoading}>
              <Text
                size='11'
                lineHeight='16'
                className='text-color-24'
              >
                {Format.price(availableRewardsPriceFormatted, 'standard')}
              </Text>
            </Skeleton>
          </Condition>
        </div>
      </div>
      <Condition if={hasMaxPosition}>
        <div className='bg-color-21 flex w-full items-center gap-2.5 rounded-lg px-4 py-5'>
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
      <Condition if={!hasMaxPosition}>
        <div className='bg-color-26 flex w-full items-center gap-2.5 rounded-lg px-4 py-5'>
          <InfoIcon className='text-color-7 size-4 shrink-0' />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='text-color-7'
          >
            The entire amount will be added to the claim balance
          </Text>
        </div>
      </Condition>
      <Button
        className={cn('h-14 w-85 flex-col', {
          'bg-color-7': isVestingLoading
        })}
        disabled={isVestButtonDisabled}
        onClick={onConfirm}
      >
        <Text
          size='13'
          weight='500'
          lineHeight='18'
          className={cn('text-white', {
            'text-color-6': isVestButtonDisabled,
            'after-animate-loading-dots text-white': isVestingLoading
          })}
        >
          {isVestingLoading ? 'Pending' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
