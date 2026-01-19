import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useVestingClaim } from '@/pages/stake/hooks/useVestingClaim';
import { useWalletStore } from '@/stores/useWalletStore';

export type VestingModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onVestingConfirmed?: () => void;
};

export function VestingModal({ isOpen = false, onClose = noop, onVestingConfirmed = noop }: VestingModalProps) {
  const { isConnected, address } = useConnection();

  const { setIsPendingToggle } = useWalletStore();

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: availableRewards, isLoading: isAvailableRewardsLoading } = useAvailableRewards(address);

  const { sendTransactionAsync: vestRequest, data: vestHash, isPending: isVestPending } = useVestingClaim();

  const { isLoading: isVestingConfirming, isSuccess: isVestSuccess } = useWaitForTransactionReceipt({
    hash: vestHash
  });

  const baseTokenPriceValue = baseTokenPrice ?? 0n;
  const availableRewardsPriceFormatted = formatUnits(
    (availableRewards ?? 0n) * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const availableRewardsFormatted = formatUnits(availableRewards ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

  const isVestingLoading = isVestPending || isVestingConfirming;
  const isLoading = isConnected ? isAvailableRewardsLoading || isBaseTokenPriceLoading : false;

  const isClaimButtonDisabled = isLoading || isVestPending;

  const onConfirm = async () => {
    if (!address) return;

    await vestRequest(address);
  };

  useEffect(() => {
    if (!isVestSuccess) return;

    setIsPendingToggle(false);
    onClose();
    onVestingConfirmed();
  }, [isVestSuccess]);

  return (
    <Modal
      title='Vesting'
      open={isOpen}
      onClose={onClose}
    >
      <div className='mt-8 flex flex-col gap-8'>
        <Divider orientation='horizontal' />
        <div className='flex'>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be vested
          </Text>
          <div className='flex shrink-0 flex-col items-end'>
            <Skeleton loading={isLoading}>
              <Text
                size='15'
                weight='500'
                lineHeight='20'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected && !!availableRewards ? Format.token(availableRewardsFormatted, 'compact') : '0.0000'} COMP
              </Text>
            </Skeleton>
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
        <div className='bg-color-26 flex w-full items-center gap-2.5 rounded-lg px-4 py-5'>
          <InfoIcon className='text-color-7 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-7'
          >
            The whole amount will be added to your Claim balance
          </Text>
        </div>
        <Button
          className={cn('h-14 flex-col', {
            'bg-color-7': isVestingLoading
          })}
          disabled={isVestingLoading}
          onClick={onConfirm}
        >
          <Text
            size='13'
            weight='500'
            lineHeight='18'
            className={cn('text-white', {
              'text-color-6': isClaimButtonDisabled,
              'text-white': isVestingLoading
            })}
          >
            {isVestingLoading ? 'Pending...' : 'Confirm'}
          </Text>
        </Button>
      </div>
    </Modal>
  );
}
