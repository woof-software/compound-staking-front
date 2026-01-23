import { useEffect, useEffectEvent, useRef } from 'react';
import { formatUnits } from 'viem';
import { useConnection, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useAvailableRewards } from '@/hooks/useAvailableRewards';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { sliceAddress } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useWalletStore } from '@/stores/useWalletStore';

import CompoundWalletIcon from '@/assets/compound-wallet-icon.svg';
import Spinner from '@/assets/spinner.svg';

export type ConnectedButtonProps = {
  onChangeWallet: () => void;
};

export function ConnectedButton({ onChangeWallet: onWalletChange }: ConnectedButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  const isPending = useWalletStore(({ isPending }) => isPending);

  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();

  const { isEnabled: isOpen, toggle: onOpen, disable: onClose } = useSwitch();

  const {
    data: availableRewards,
    refetch: refetchAvailableRewards,
    isLoading: isAvailableRewardsLoading
  } = useAvailableRewards(address);

  const availableRewardsFormatted = formatUnits(availableRewards ?? 0n, ENV.STAKED_TOKEN_DECIMALS);

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

  const onRefetchAvailableRewards = useEffectEvent(() => {
    refetchAvailableRewards();
  });

  useEffect(() => {
    if (!isConnected) return;

    onRefetchAvailableRewards();
  }, [isConnected]);

  useOutsideClick(() => [ref.current, toggleRef.current], onClose);

  return (
    <div className='relative'>
      <Condition if={!isAvailableRewardsLoading}>
        <div className='rounded-64 bg-color-11 border-color-8 absolute right-[68%] flex h-11 min-w-[6.45rem] items-center border-[0.25px] py-2 pr-11 pl-4 hover:brightness-90'>
          <CompoundWalletIcon className='size-6 flex-shrink-0' />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='text-color-2 ml-2'
          >
            {isConnected && !!availableRewards ? Format.token(availableRewardsFormatted, 'compact') : '0.0000'}
          </Text>
        </div>
      </Condition>
      <div
        ref={toggleRef}
        onClick={onOpen}
        className='rounded-64 shadow-20 flex h-11 max-w-fit cursor-pointer justify-end'
      >
        <Condition if={!isPending}>
          <div className='border-color-8 shadow-25 bg-color-4 rounded-64 relative h-11 border-[0.25px] px-5 py-[13.5px] hover:brightness-90'>
            <Text
              size='11'
              weight='500'
              lineHeight='14'
              className='text-color-2'
            >
              {sliceAddress(address ?? '')}
            </Text>
          </div>
        </Condition>
        <Condition if={isPending}>
          <div className='bg-color-7 rounded-64 relative -top-[0.5px] flex h-11 min-w-28 items-center justify-center gap-2 hover:brightness-90'>
            <Spinner className='size-4 flex-shrink-0 animate-spin' />
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-white'
            >
              1 Pending
            </Text>
          </div>
        </Condition>
      </div>
      <Condition if={isOpen}>
        <div
          ref={ref}
          className='bg-color-4 border-color-8 animate-bounce-smooth absolute top-12 right-0 flex h-auto min-h-44.75 min-w-80 flex-col gap-3 rounded-2xl border-[0.25px] p-5'
        >
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='text-color-24'
          >
            Connected Wallet
          </Text>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center justify-start gap-2'>
              <div className='bg-color-24 size-[9px] rounded-full' />
              <Text
                size='13'
                weight='500'
                lineHeight='16'
                className='text-color-2'
              >
                {sliceAddress(address ?? '')}
              </Text>
            </div>
            <div className='mb-[3px]'>
              <CopyIcon
                onClick={onAddressCopy}
                className='text-color-2 size-3 cursor-pointer transition-all duration-200 hover:brightness-90'
              />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <Button
              onClick={onDisconnect}
              className='bg-color-16 h-8.5 text-[11px] leading-4 font-medium'
            >
              Disconnect Wallet
            </Button>
            <Button
              onClick={onChangeWallet}
              className='bg-color-16 h-8.5 text-[11px] leading-4 font-medium'
            >
              Change Wallet
            </Button>
          </div>
        </div>
      </Condition>
    </div>
  );
}
