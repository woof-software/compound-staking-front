import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem'; // parseUnits понадобится ниже (если захочешь bigint обратно)
import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { Duration } from '@/components/common/Duration';
import { Card } from '@/components/common/stake/Card';
import { ClaimModal } from '@/components/common/stake/ClaimModal';
import { VestingModal } from '@/components/common/stake/VestingModal';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { max } from '@/lib/utils/numeric';
import { RewardsTable, type RewardsTableItem } from '@/pages/stake/components/rewards-flow-block/RewardsTable';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';
import { useRewardStore } from '@/stores/useRewardStore';

export function RewardsFlowBlock() {
  const [claimAmount, setClaimAmount] = useState<bigint>(0n);

  const { isConnected, address } = useConnection();
  const { needRefresh: needRewardRefresh, resetRefresh: resetRewardRefresh } = useRewardStore();

  const { isEnabled: isVestingOpen, enable: onVestingOpen, disable: onVestingClose } = useSwitch();
  const { isEnabled: isClaimOpen, enable: onClaimOpen, disable: onClaimClose } = useSwitch();

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const {
    data: availableRewards,
    refetch: refetchAvailableRewards,
    isLoading: isAvailableRewardsLoading
  } = useAvailableRewards(address);

  const {
    data: vestingPositions = [],
    refetch: refetchVestingPositions,
    isLoading: isVestingLoading
  } = useVestingPosition(address);

  const rows = useMemo(() => {
    return vestingPositions.map(({ amount, claimedAmount, startTime, duration }) => {
      const endDate = startTime + duration;

      const elapsed = BigInt(endDate - startTime);

      return {
        vestingAmount: amount,
        claimedAmount: claimedAmount,
        endDate: endDate,
        startDate: startTime,
        toClaim: (amount * elapsed) / (BigInt(duration) || 1n) - claimedAmount
      } satisfies RewardsTableItem;
    });
  }, [vestingPositions]);

  const availableRewardsPriceFormatted = formatUnits(
    (availableRewards ?? 0n) * (baseTokenPrice ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const availableRewardsFormatted = formatUnits(availableRewards ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

  const totalVesting = rows.reduce((acc, r) => {
    return acc + r.vestingAmount;
  }, 0n);

  const hasAvailableRewards = (availableRewards ?? 0n) > 0n;
  const hasPosition = rows.length > 0;

  const isLoading = isConnected ? isVestingLoading || isAvailableRewardsLoading || isBaseTokenPriceLoading : false;

  const isClaimButtonDisabled = !isConnected || isLoading || !hasPosition || isClaimOpen;
  const isVestButtonDisabled = !isConnected || isLoading || !hasAvailableRewards || isVestingOpen;

  const onVestingConfirmed = () => {
    refetchAvailableRewards();
    refetchVestingPositions();
  };

  const onClaimConfirmed = () => {
    refetchVestingPositions();
  };

  const onClaimModalOpen = () => {
    const toClaim = rows.reduce((acc, record) => {
      const { startDate: vestingStartDate, endDate: vestingEndDate, claimedAmount, vestingAmount } = record;

      const totalSecNum = Math.max(0, vestingEndDate - vestingStartDate);

      const secondsLeft = vestingEndDate - Date.now();

      const elapsed = BigInt(totalSecNum - secondsLeft);

      const total = BigInt(totalSecNum);

      const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

      const toClaim = max(vested, 0n);

      return acc + toClaim;
    }, 0n);

    setClaimAmount(toClaim);

    onClaimOpen();
  };

  const onClaimModalClose = () => {
    setClaimAmount(0n);
    onClaimClose();
  };

  useEffect(() => {
    if (!isConnected || !needRewardRefresh) return;

    refetchVestingPositions();
    resetRewardRefresh();
  }, [needRewardRefresh, isConnected, refetchVestingPositions, resetRewardRefresh]);

  const longestDurationTs = rows.reduce((acc, { endDate }) => {
    return acc > endDate ? acc : endDate;
  }, 0);

  return (
    <>
      <Card
        isLoading={isLoading}
        title='Rewards'
      >
        <div className='border-color-8 flex justify-between border-b-1 p-10'>
          <div className='flex w-full max-w-120 justify-between'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                weight='500'
                className='text-color-24'
              >
                Total vesting
              </Text>
              <Skeleton loading={isLoading}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2 tabular-nums', { 'text-color-6': !isConnected })}
                >
                  {isConnected && hasPosition ? Format.token(String(totalVesting), 'compact') : '0.0000'} COMP
                </Text>
              </Skeleton>
            </div>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                weight='500'
                className='text-color-24'
              >
                Total to claim
              </Text>
              <Skeleton loading={isLoading}>
                <Text
                  size='17'
                  weight='500'
                  className={cn('text-color-2 tabular-nums', { 'text-color-6': !isConnected })}
                >
                  {isConnected && hasPosition ? (
                    <Duration
                      end={longestDurationTs}
                      render={() => {
                        const toClaim = rows.reduce((acc, record) => {
                          const {
                            startDate: vestingStartDate,
                            endDate: vestingEndDate,
                            claimedAmount,
                            vestingAmount
                          } = record;

                          const totalSecNum = Math.max(0, vestingEndDate - vestingStartDate);

                          const secondsLeft = vestingEndDate - Date.now();

                          const elapsed = BigInt(totalSecNum - secondsLeft);

                          const total = BigInt(totalSecNum);

                          const vested = (vestingAmount * elapsed) / (total || 1n) - claimedAmount;

                          const toClaim = max(vested, 0n);

                          return acc + toClaim;
                        }, 0n);

                        const toClaimFormatted = formatUnits(toClaim, ENV.STAKED_TOKEN_DECIMALS);

                        return Format.token(toClaimFormatted, 'compact');
                      }}
                    />
                  ) : (
                    '0.0000'
                  )}{' '}
                  COMP
                </Text>
              </Skeleton>
            </div>
            <Button
              disabled={isClaimButtonDisabled}
              onClick={onClaimModalOpen}
              className='max-w-32.5 text-[11px] font-medium'
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
                  className={cn('text-color-6', { 'text-white': !isClaimButtonDisabled })}
                >
                  Claim
                </Text>
              </Skeleton>
            </Button>
          </div>
          <Divider orientation='vertical' />
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
                  className={cn('text-color-2 tabular-nums', { 'text-color-6': !isConnected })}
                >
                  {isConnected && !!availableRewards ? Format.token(availableRewardsFormatted, 'compact') : '0.0000'}
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
          <Button
            disabled={isVestButtonDisabled}
            onClick={onVestingOpen}
            className='max-w-32.5 text-[11px] font-medium'
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
                className={cn('text-color-6', { 'text-white': !isVestButtonDisabled })}
              >
                Vest
              </Text>
            </Skeleton>
          </Button>
        </div>
        <Condition if={!hasPosition}>
          <div className='flex p-10'>
            <div className='mx-auto flex w-auto flex-col items-center gap-5'>
              <div className='no-position-yet h-20 w-44' />
              <Text
                size='15'
                weight='500'
                lineHeight='16'
              >
                No Positions Yet
              </Text>
              <Text
                size='15'
                weight='500'
                lineHeight='21'
                className='text-color-24'
              >
                No vested rewards yet
              </Text>
            </div>
          </div>
        </Condition>
        <Condition if={isConnected && hasPosition}>
          <RewardsTable rows={rows} />
        </Condition>
      </Card>
      <VestingModal
        isOpen={isVestingOpen}
        onClose={onVestingClose}
        onVestingConfirmed={onVestingConfirmed}
      />
      <ClaimModal
        totalToClaim={claimAmount}
        isOpen={isClaimOpen}
        onClose={onClaimModalClose}
        onClaimConfirmed={onClaimConfirmed}
      />
    </>
  );
}
