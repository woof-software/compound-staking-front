import { useEffect, useEffectEvent } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useDisconnect } from 'wagmi';

import { CopyIcon, CrossIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { cn } from '@/lib/utils/cn';
import { sliceAddress } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { getAddressContracts } from '@/lib/utils/helpers';
import { useWalletStore } from '@/stores/useWalletStore';

import CompoundWalletIcon from '@/assets/compound-wallet-icon.svg';
import Wallet from '@/assets/wallet.svg';

export type ConnectedButtonProps = {
  onChangeWallet: () => void;
};

export function ConnectedButtonMobile({ onChangeWallet: onWalletChange }: ConnectedButtonProps) {
  const isPending = useWalletStore(({ isPending }) => isPending);

  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();

  const { baseTokenAddress } = getAddressContracts(APPLICATION_CHAIN);

  const { isEnabled: isOpen, disable: onClose, toggle: onToggle } = useSwitch();

  const {
    data: availableRewards,
    refetch: refetchAvailableRewards,
    isLoading: isAvailableRewardsLoading
  } = useAvailableRewards(APPLICATION_CHAIN, address);

  const {
    data: walletBalance,
    refetch: refetchWalletBalance,
    isLoading: isWalletBalanceLoading
  } = useTokenBalance(address, baseTokenAddress);

  const balance = (availableRewards ?? 0n) + (walletBalance ?? 0n);

  const balanceFormatted = formatUnits(balance, ENV.STAKED_TOKEN_DECIMALS);

  const onDisconnect = () => {
    onClose();
    disconnect();
  };

  const onChangeWallet = () => {
    onClose();
    onWalletChange();
  };

  const onAddressCopy = async () => {
    onClose();

    await navigator.clipboard.writeText(address!);
  };

  const onRefetchData = useEffectEvent(() => {
    refetchAvailableRewards();
    refetchWalletBalance();
  });

  useEffect(() => {
    if (!isConnected) return;

    onRefetchData();
  }, [isConnected]);

  return (
    <div className='block md:hidden'>
      <Button
        onClick={onToggle}
        className={cn(
          'bg-color-9 relative flex h-11 w-11 items-center justify-center rounded-full text-[11px] leading-4 font-medium hover:brightness-100 md:hidden',
          {
            'bg-color-7': isPending
          }
        )}
      >
        <Condition if={isPending}>1</Condition>
        <Condition if={!isOpen && !isPending}>
          <Wallet
            width='16'
            height='16'
          />
        </Condition>
        <Condition if={isOpen && !isPending}>
          <CrossIcon
            width='24'
            height='24'
            className='shrink-0'
          />
        </Condition>
        <Condition if={!isOpen}>
          <div
            className={cn('bg-color-7 border-color-1 absolute right-0 -bottom-[1px] h-4 w-4 rounded-full border-3', {
              'bg-color-23': isPending
            })}
          />
        </Condition>
      </Button>
      <aside
        className={cn(
          'bg-color-1 fixed top-17 right-0 z-[100] flex h-[stretch] w-full transform flex-col justify-between transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='mt-30 flex flex-col gap-2 px-6'>
          <Text
            size='11'
            weight='500'
            className='text-color-24 ml-4'
          >
            Connected Wallet
          </Text>
          <div className='flex items-center gap-2 py-1 pr-4'>
            <div className='bg-color-7 h-2 w-2 rounded-full' />
            <Skeleton loading={isWalletBalanceLoading || isAvailableRewardsLoading}>
              <Text
                size='32'
                weight='600'
                lineHeight='36'
                className='text-color-2'
              >
                {sliceAddress(address ?? '')}
              </Text>
            </Skeleton>
            <CopyIcon
              onClick={onAddressCopy}
              className='text-color-2 ml-auto size-6'
            />
          </div>
        </div>
        <div className='flex flex-col gap-8 px-10 pt-5 pb-10'>
          <div className='flex flex-col gap-2'>
            <Text
              size='11'
              weight='500'
              className='text-color-24 ml-4'
            >
              COMP Distribution
            </Text>
            <div className='rounded-64 bg-color-17 flex items-center gap-2 p-4'>
              <CompoundWalletIcon
                width='28'
                height='28'
              />
              <Text
                size='13'
                weight='500'
                lineHeight='16'
                className='text-color-2'
              >
                {Format.token(balanceFormatted)}
              </Text>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={onDisconnect}
              className='bg-color-16 h-11 text-[13px] leading-4 font-medium'
            >
              Disconnect
            </Button>
            <Button
              onClick={onChangeWallet}
              className='bg-color-16 h-11 text-[13px] leading-4 font-medium'
            >
              Change Wallet
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
