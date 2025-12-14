import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { COMP_DECIMALS, STAKED_TOKEN_DECIMALS } from '@/consts/common';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { StakeModal } from '@/pages/stake/components/stake-flow-block/StakeModal';
import { useStakeTransaction } from '@/pages/stake/hooks/useStakeTransaction';

export function StakeFlowBlock() {
  const { isConnected } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { isLoading, isStakedCOMPBalanceFetching, COMPBalance, stakedCOMPBalance } = useStakeTransaction();

  const isLoadingData = isLoading || isStakedCOMPBalanceFetching;

  const isStakeButtonDisabled = !isConnected || isLoadingData;

  const onStakeButtonClick = () => {
    onOpen();
  };

  return (
    <Card
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <div className='justify-between flex p-10'>
        <div className='flex flex-col gap-3'>
          <Text
            size='11'
            className='text-color-24'
          >
            Staked
          </Text>
          <Skeleton loading={isLoadingData}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? formatUnits(COMPBalance.amount, COMP_DECIMALS) : '0.0000'} COMP
            </Text>
          </Skeleton>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            stCOMP balance
          </Text>
          <Skeleton loading={isLoadingData}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? formatUnits(stakedCOMPBalance, STAKED_TOKEN_DECIMALS) : '0.0000'} stCOMP
            </Text>
          </Skeleton>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            Multiplier
          </Text>
          <Skeleton loading={isLoadingData}>
            <Text
              size='17'
              weight='500'
              className={cn('text-color-2', {
                'text-color-6': !isConnected
              })}
            >
              {isConnected ? '1x' : '-'}
            </Text>
          </Skeleton>
        </div>
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            Available Rewards
          </Text>
          <Skeleton loading={isLoadingData}>
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
        <div className='gap-3 flex flex-col'>
          <Text
            size='11'
            className='text-color-24'
          >
            APR
          </Text>
          <Skeleton loading={isLoadingData}>
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
          onClick={onStakeButtonClick}
        >
          Stake
        </Button>
      </div>
      <Modal
        title='Stake COMP tokens'
        open={isOpen}
        onClose={onClose}
      >
        <StakeModal onClose={onClose} />
      </Modal>
    </Card>
  );
}
