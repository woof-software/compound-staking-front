import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useStakedBalance } from '@/hooks/useStakedBalance';
import { useStakeTransaction } from '@/hooks/useStakeTransaction';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVirtualBalance } from '@/hooks/useVirtualBalance';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { StakeModal } from '@/pages/stake/components/stake-flow-block/StakeModal';

export function StakeFlowBlock() {
  const { isConnected, address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { isSuccess: isStakeSuccess } = useStakeTransaction();

  const {
    data: stakedBalance,
    isLoading: isStakedBalanceFormattedFetching,
    refetch: refetchStakedBalanceFormatted
  } = useStakedBalance(address);

  const { data: virtualBalance, refetch: refetchVirtualBalance } = useVirtualBalance(address);

  const { data: baseTokenPrice, isFetching: isBaseTokenPriceFetching } = useTokenPrice(
    ENV.BASE_TOKEN_PRICE_FEED_ADDRESS
  );

  const isLoading = isStakedBalanceFormattedFetching || isBaseTokenPriceFetching;

  const isStakeButtonDisabled = !isConnected || isOpen || isLoading;

  const stakedBalanceFormatted = formatUnits(stakedBalance?.principal ?? 0n, ENV.BASE_TOKEN_DECIMALS);
  const virtualBalanceFormatted = formatUnits(virtualBalance ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

  const stakedBalancePriceFormatted = formatUnits(
    (stakedBalance?.principal ?? 0n) * (baseTokenPrice ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const multiplier = +(virtualBalanceFormatted || '1') / +stakedBalanceFormatted;

  useEffect(() => {
    if (isStakeSuccess) {
      refetchStakedBalanceFormatted();
      refetchVirtualBalance();
    }
  }, [isStakeSuccess]);

  return (
    <Card
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <div className='flex justify-between p-10'>
        <div className='flex flex-col gap-3'>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              className='text-color-24'
            >
              Staked
            </Text>
          </Skeleton>
          <div className='flex flex-col gap-2'>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? Format.token(stakedBalanceFormatted, 'compact') : '0.0000'} COMP
              </Text>
            </Skeleton>
            <Condition if={isConnected}>
              <Skeleton loading={isLoading}>
                <Text
                  size='11'
                  className='text-color-24'
                >
                  {Format.price(stakedBalancePriceFormatted, 'standard')}
                </Text>
              </Skeleton>
            </Condition>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              className='text-color-24'
            >
              stCOMP balance
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? Format.token(virtualBalanceFormatted, 'compact') : '0.0000'} stCOMP
            </Text>
          </Skeleton>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              className='text-color-24'
            >
              Multiplier
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? (multiplier ? `${Format.rate(multiplier)}x` : '1x') : '-'}
            </Text>
          </Skeleton>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              className='text-color-24'
            >
              Available Rewards
            </Text>
          </Skeleton>
          <div className='flex flex-col gap-2'>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                weight='500'
                className={cn('text-color-2', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? '0.0000' : '0.0000'} COMP
              </Text>
            </Skeleton>
            <Condition if={isConnected}>
              <Skeleton loading={isLoading}>
                <Text
                  size='11'
                  className='text-color-24'
                >
                  {Format.price(stakedBalancePriceFormatted, 'standard')}
                </Text>
              </Skeleton>
            </Condition>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              className='text-color-24'
            >
              APR
            </Text>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? '0.00' : '0.00'}%
            </Text>
          </Skeleton>
        </div>
        <Button
          disabled={isStakeButtonDisabled}
          className='max-w-32.5 text-[11px] font-medium'
          onClick={onOpen}
        >
          Stake
        </Button>
      </div>
      <Modal
        title='Stake COMP tokens'
        open={isOpen}
        onClose={onClose}
      >
        <StakeModal />
      </Modal>
    </Card>
  );
}
