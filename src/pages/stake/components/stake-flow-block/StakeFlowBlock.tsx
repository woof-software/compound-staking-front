import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useMultiplier } from '@/hooks/useMultiplier';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVirtualBalance } from '@/hooks/useVirtualBalance';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { StakeModal } from '@/pages/stake/components/stake-flow-block/StakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useRewardStore } from '@/stores/useRewardStore';
import { useStatisticStore } from '@/stores/useStatisticStore';

export function StakeFlowBlock() {
  const { isConnected, address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const triggerStatisticRefresh = useStatisticStore(({ triggerRefresh }) => triggerRefresh);
  const triggerDelegateRefresh = useDelegateStore(({ triggerRefresh }) => triggerRefresh);
  const triggerRewardRefresh = useRewardStore(({ triggerRefresh }) => triggerRefresh);

  const {
    data: stakedBalance,
    isLoading: isStakedBalanceLoading,
    refetch: refetchStakedBalanceFormatted
  } = useStakedBalance(address);

  const { data: virtualBalance, refetch: refetchVirtualBalance } = useVirtualBalance(address);

  const { data: multiplier, refetch: refetchMultiplier } = useMultiplier(address);
  const { data: availableRewards, refetch: refetchAvailableRewards } = useAvailableRewards(address);

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: lockedTokenBalance } = useLockedBalance(address);

  const { isLoading: isStakedTokenPrice } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);
  const { isLoading: isStakedTokenWalletBalance } = useTokenBalance(address, ENV.BASE_TOKEN_ADDRESS);

  /* Loading */
  const isPriceOrBalanceLoading = isStakedTokenPrice || isStakedTokenWalletBalance;
  const isTokenBalanceLoading = isStakedBalanceLoading || isBaseTokenPriceLoading;
  const isLoading = isConnected ? isPriceOrBalanceLoading || isTokenBalanceLoading : false;

  const isStakeButtonDisabled = !isConnected || isOpen || isLoading || (lockedTokenBalance?.amount ?? 0n) > 0n;

  const stakedBalanceFormatted = formatUnits(stakedBalance?.principal ?? 0n, ENV.BASE_TOKEN_DECIMALS);
  const virtualBalanceFormatted = formatUnits(virtualBalance ?? 0n, ENV.STAKED_TOKEN_DECIMALS);
  const multiplierFormatted = formatUnits(multiplier ?? 0n, 18);
  const availableRewardsFormatted = formatUnits(availableRewards ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

  const baseTokenPriceValue = baseTokenPrice ?? 0n;
  const stakedBalancePriceFormatted = formatUnits(
    (stakedBalance?.principal ?? 0n) * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );
  const availableRewardsPriceFormatted = formatUnits(
    (availableRewards ?? 0n) * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const onStakeConfirmed = () => {
    refetchStakedBalanceFormatted();
    refetchVirtualBalance();
    refetchMultiplier();
    refetchAvailableRewards();

    triggerStatisticRefresh();
    triggerDelegateRefresh();
    triggerRewardRefresh();
  };

  return (
    <Card
      isLoading={isLoading}
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <div className='flex justify-between p-10'>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            Staked
          </Text>
          <div className='flex flex-col gap-2'>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                className={cn('text-color-2 tabular-nums', {
                  'text-color-6': !isConnected
                })}
              >
                {Format.token(stakedBalanceFormatted, 'compact', 'COMP')}
              </Text>
            </Skeleton>
            <Condition if={isConnected && !!stakedBalance?.principal}>
              <Skeleton loading={isLoading}>
                <Text
                  size='11'
                  className='text-color-24 tabular-nums'
                >
                  {Format.price(stakedBalancePriceFormatted, 'standard')}
                </Text>
              </Skeleton>
            </Condition>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            stCOMP balance
          </Text>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2 tabular-nums', {
                'text-color-6': !isConnected
              })}
            >
              {Format.token(virtualBalanceFormatted, 'compact', 'COMP')}
            </Text>
          </Skeleton>
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            Multiplier
          </Text>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2 tabular-nums', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? (multiplier ? `${Format.rate(+multiplierFormatted)}x` : '1x') : '-'}
            </Text>
          </Skeleton>
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            Available Rewards
          </Text>
          <div className='flex flex-col gap-2'>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                className={cn('text-color-2 tabular-nums', {
                  'text-color-6': !isConnected
                })}
              >
                {Format.token(availableRewardsFormatted, 'compact', 'COMP')}
              </Text>
            </Skeleton>
            <Condition if={isConnected && !!availableRewards}>
              <Skeleton loading={isLoading}>
                <Text
                  size='11'
                  className='text-color-24 tabular-nums'
                >
                  {Format.price(availableRewardsPriceFormatted, 'standard')}
                </Text>
              </Skeleton>
            </Condition>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            APR
          </Text>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2 tabular-nums', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? '0.00' : '0.00'}%
            </Text>
          </Skeleton>
        </div>
        <Button
          disabled={isStakeButtonDisabled}
          className='max-w-32.5'
          onClick={onOpen}
        >
          <Skeleton
            loading={isLoading}
            className='w-full'
          >
            <Text
              tag='p'
              size='11'
              weight='500'
              align='center'
              className={cn('text-color-6', {
                'text-white': !isStakeButtonDisabled
              })}
            >
              Stake
            </Text>
          </Skeleton>
        </Button>
      </div>
      <Modal
        title='Stake COMP tokens'
        open={isOpen}
        onClose={onClose}
      >
        <StakeModal
          onStakeConfirmed={onStakeConfirmed}
          onClose={onClose}
        />
      </Modal>
    </Card>
  );
}
