import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useStakedBalance } from '@/hooks/useStakedBalance';
import { useStakeTransaction } from '@/hooks/useStakeTransaction';
import { useSwitch } from '@/hooks/useSwitch';
import { useVirtualBalance } from '@/hooks/useVirtualBalance';
import { cn } from '@/lib/utils/cn';
import { Format } from '@/lib/utils/format';
import { StakeModal } from '@/pages/stake/components/stake-flow-block/StakeModal';

export function StakeFlowBlock() {
  const { isConnected, address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { isSuccess: isStakeSuccess } = useStakeTransaction();

  const {
    data: baseTokenBalance,
    isFetching: isBaseTokenBalanceFetching,
    refetch: refetchBaseTokenBalance
  } = useStakedBalance(address);
  const { data: virtualBalance, refetch: refetchVirtualBalance } = useVirtualBalance(address);

  const isStakeButtonDisabled = !isConnected || isOpen;

  const baseTokenBalanceFormatted = formatUnits(BigInt(baseTokenBalance?.principal ?? 0), ENV.BASE_TOKEN_DECIMALS);
  const stakedTokenBalanceFormatted = formatUnits(BigInt(virtualBalance ?? 0), ENV.STAKED_TOKEN_DECIMALS);

  const multiplier = +(stakedTokenBalanceFormatted || '1') / +baseTokenBalanceFormatted;

  useEffect(() => {
    if (isStakeSuccess) {
      refetchBaseTokenBalance();
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
          <Text
            size='11'
            className='text-color-24'
          >
            Staked
          </Text>
          <Skeleton loading={isBaseTokenBalanceFetching}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? Format.token(baseTokenBalanceFormatted, 'compact') : '0.0000'} COMP
            </Text>
          </Skeleton>
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            className='text-color-24'
          >
            stCOMP balance
          </Text>
          <Skeleton loading={isBaseTokenBalanceFetching}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? Format.token(stakedTokenBalanceFormatted, 'compact') : '0.0000'} stCOMP
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
          <Skeleton loading={isBaseTokenBalanceFetching}>
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
          <Text
            size='11'
            className='text-color-24'
          >
            Available Rewards
          </Text>
          <Skeleton loading={isBaseTokenBalanceFetching}>
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
        </div>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            className='text-color-24'
          >
            APR
          </Text>
          <Skeleton loading={isBaseTokenBalanceFetching}>
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
