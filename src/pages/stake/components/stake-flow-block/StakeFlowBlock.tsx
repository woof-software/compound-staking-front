import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { MIN_1024 } from '@/consts/media';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useDelegateSubAccount } from '@/hooks/useDelegateSubAccount';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMultiplier } from '@/hooks/useMultiplier';
import { useSubAccount } from '@/hooks/useSubAccount';
import { useSwitch } from '@/hooks/useSwitch';
import { useInvalidateTokenBalance, useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVirtualBalance } from '@/hooks/useVirtualBalance';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { getAddressContracts, when } from '@/lib/utils/helpers';
import { StakeModal } from '@/pages/stake/components/stake-flow-block/StakeModal';
import { useLockedBalance } from '@/pages/stake/hooks/useLockedBalance';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useStatisticStakingAPR } from '@/pages/stake/hooks/useStatisticStakingAPR';
import { useUserAPR } from '@/pages/stake/hooks/useUserAPR';
import { useDelegateStore } from '@/stores/useDelegateStore';
import { useRewardStore } from '@/stores/useRewardStore';
import { useStatisticStore } from '@/stores/useStatisticStore';
import { trySwitchToApplicationChain } from '@/stores/useSwitchNetworkModalStore';
import { useWalletStore } from '@/stores/useWalletStore';

import CompoundBlackCircle from '@/assets/svg/compound-black-circle.svg';

export function StakeFlowBlock() {
  const { isConnected, address, chainId } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const isDesktop = useMediaQuery(MIN_1024);

  const triggerStatisticRefresh = useStatisticStore(({ triggerRefresh }) => triggerRefresh);
  const triggerDelegateRefresh = useDelegateStore(({ triggerRefresh }) => triggerRefresh);
  const triggerRewardRefresh = useRewardStore(({ triggerRefresh }) => triggerRefresh);
  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const invalidateTokenBalance = useInvalidateTokenBalance();

  const { baseTokenAddress } = getAddressContracts(APPLICATION_CHAIN);

  const {
    data: stakedBalance,
    isLoading: isStakedBalanceLoading,
    refetch: refetchStakedBalanceFormatted
  } = useStakedBalance(APPLICATION_CHAIN, address);

  const { data: subAccountAddress } = useDelegateSubAccount(APPLICATION_CHAIN, address);

  const { data: delegateData } = useSubAccount(APPLICATION_CHAIN, subAccountAddress);

  const { data: virtualBalance, refetch: refetchVirtualBalance } = useVirtualBalance(APPLICATION_CHAIN, address);

  const { data: multiplier, refetch: refetchMultiplier } = useMultiplier(APPLICATION_CHAIN, address);
  const { data: availableRewards, refetch: refetchAvailableRewards } = useAvailableRewards(APPLICATION_CHAIN, address);

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: lockedTokenBalance } = useLockedBalance(APPLICATION_CHAIN, address);

  const { isLoading: isStakedTokenPrice } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);
  const { isLoading: isStakedTokenWalletBalance } = useTokenBalance(address, baseTokenAddress);

  const { data: userApr, refetch: refetchUerAPR } = useUserAPR(address, APPLICATION_CHAIN);

  const { refetch: refetchStatisticStakingAPR } = useStatisticStakingAPR(APPLICATION_CHAIN);

  const formattedUserApr = Format.rate(+formatUnits(userApr ?? 0n, ENV.BASE_APR_DECIMALS));

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

  const delegateAddress = when((stakedBalance?.principal ?? 0n) > 0n, delegateData?.delegatee);

  const onModalClose = () => {
    setIsPendingToggle(false);
    onClose();
  };

  const onStakeConfirmed = () => {
    refetchStakedBalanceFormatted();
    refetchVirtualBalance();
    refetchMultiplier();
    refetchAvailableRewards();
    refetchUerAPR();
    refetchStatisticStakingAPR();

    triggerStatisticRefresh();
    triggerDelegateRefresh();
    triggerRewardRefresh();

    if (address && baseTokenAddress) {
      invalidateTokenBalance({
        chainId: APPLICATION_CHAIN,
        owner: address,
        token: baseTokenAddress
      });
    }

    onClose();
  };

  const onStakeModalOpen = () => {
    trySwitchToApplicationChain(chainId);

    onOpen();
  };

  return (
    <Card
      isLoading={isLoading}
      title='Stake'
      tooltip='Stake COMP for on-chain yield'
    >
      <div className='flex flex-col justify-between gap-10 p-5 md:flex-row md:gap-0 md:p-10 lg:gap-10'>
        <div className='grid w-full grid-cols-2 gap-10 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-start'>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Staked
            </Text>
            <div className='flex flex-col gap-2.5 lg:gap-1'>
              <Skeleton loading={isLoading}>
                <div className='flex items-center gap-1.5'>
                  <CompoundBlackCircle className='text-compound-icon-bg block size-4 lg:hidden' />
                  <Text
                    size='17'
                    className={cn('text-color-2 tabular-nums', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {Format.token(stakedBalanceFormatted, { symbol: when(isDesktop, 'COMP') })}
                  </Text>
                </div>
              </Skeleton>
              <Condition if={isConnected && stakedBalance?.principal}>
                <Skeleton loading={isLoading}>
                  <Text
                    size='11'
                    className='text-color-24 max-w-40 truncate tabular-nums'
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
              className='text-color-24'
            >
              stCOMP balance
            </Text>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                className={cn('text-color-2 max-w-40 truncate tabular-nums', {
                  'text-color-6': !isConnected
                })}
              >
                {Format.token(virtualBalanceFormatted, { symbol: when(isDesktop, 'stCOMP') })}
              </Text>
            </Skeleton>
          </div>
          <div className='flex flex-col gap-3'>
            <Text
              size='11'
              className='text-color-24'
            >
              Multiplier
            </Text>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                className={cn('text-color-2 max-w-40 truncate tabular-nums', {
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
              className='text-color-24'
            >
              Available Rewards
            </Text>
            <div className='flex flex-col gap-2.5 lg:gap-1'>
              <Skeleton loading={isLoading}>
                <div className='flex max-w-40 items-center gap-1.5 truncate'>
                  <CompoundBlackCircle className='text-compound-icon-bg block size-4 lg:hidden' />
                  <Text
                    size='17'
                    className={cn('text-color-2 tabular-nums', {
                      'text-color-6': !isConnected
                    })}
                  >
                    {Format.token(availableRewardsFormatted, { symbol: when(isDesktop, 'COMP') })}
                  </Text>
                </div>
              </Skeleton>
              <Condition if={isConnected && availableRewards}>
                <Skeleton loading={isLoading}>
                  <Text
                    size='11'
                    className='text-color-24 max-w-40 truncate tabular-nums'
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
              className='text-color-24'
            >
              APR
            </Text>
            <Skeleton loading={isLoading}>
              <Text
                size='17'
                className={cn('text-color-2 max-w-40 truncate tabular-nums', {
                  'text-color-6': !isConnected
                })}
              >
                {isConnected ? formattedUserApr : '0.00'}%
              </Text>
            </Skeleton>
          </div>
        </div>
        <Button
          disabled={isStakeButtonDisabled}
          className='max-w-full md:max-w-32.5'
          onClick={onStakeModalOpen}
        >
          <Skeleton
            loading={isLoading}
            className='w-full'
          >
            <Text
              tag='p'
              size='11'
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
      <Condition if={isDesktop}>
        <Modal
          title='Stake tokens'
          open={isOpen}
          onClose={onModalClose}
        >
          <StakeModal
            delegateAddress={delegateAddress}
            stakedBalance={stakedBalance?.principal}
            onStakeConfirmed={onStakeConfirmed}
          />
        </Modal>
      </Condition>
      <Condition if={!isDesktop}>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
        >
          <Text
            size='17'
            align='center'
            lineHeight='20'
          >
            Stake tokens
          </Text>
          <StakeModal
            delegateAddress={delegateAddress}
            stakedBalance={stakedBalance?.principal}
            onStakeConfirmed={onStakeConfirmed}
          />
        </Drawer>
      </Condition>
    </Card>
  );
}
