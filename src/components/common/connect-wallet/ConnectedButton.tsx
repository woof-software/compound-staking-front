import { useRef } from 'react';
import { useConnection, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { useWalletStore } from '@/hooks/useWallet';
import { sliceAddress } from '@/lib/utils/common';

import CompoundWalletIcon from '@/assets/compound-wallet-icon.svg';
import Spinner from '@/assets/spinner.svg';

export type ConnectedButtonProps = {
  onChangeWallet: () => void;
};

export function ConnectedButton({ onChangeWallet: onWalletChange }: ConnectedButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { address } = useConnection();
  const { disconnect } = useDisconnect();
  const { isPending } = useWalletStore();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

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

  useOutsideClick(() => ref.current, onClose);

  return (
    <div className='relative'>
      <div
        onClick={onOpen}
        className='rounded-64 bg-color-11 shadow-20 flex h-11 max-w-fit cursor-pointer justify-end'
      >
        <div className='bg-color-11 rounded-64 flex h-11 max-w-29.5 items-center justify-center gap-2 px-3 py-2'>
          <CompoundWalletIcon className='size-4 flex-shrink-0' />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='text-color-2'
          >
            0.0000
          </Text>
        </div>
        <Condition if={!isPending}>
          <div className='bg-color-4 rounded-64 shadow-20 flex h-11 w-29.5 items-center justify-center gap-2 px-3 py-2'>
            <div className='bg-color-7 size-2 rounded-full' />
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-color-2'
            >
              {sliceAddress(address ?? '')}
            </Text>
          </div>
        </Condition>
        <Condition if={isPending}>
          <div className='bg-color-7 rounded-64 flex h-11 min-w-25 items-center justify-center gap-2'>
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
          className='bg-color-10 absolute top-12 right-0 flex h-auto min-w-64 flex-col gap-3 rounded-2xl p-5'
        >
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center justify-start gap-2'>
              <div className='bg-color-7 size-2 rounded-full' />
              <Text
                size='13'
                weight='500'
                lineHeight='18'
                className='text-color-2'
              >
                {sliceAddress(address ?? '')}
              </Text>
            </div>
            <CopyIcon
              onClick={onAddressCopy}
              className='text-color-2 hover:text-color-7 size-4 cursor-pointer transition-all duration-200 hover:brightness-90'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Button
              onClick={onDisconnect}
              className='bg-color-16 h-8 text-[11px] leading-4 font-medium'
            >
              Disconnect
            </Button>
            <Button
              onClick={onChangeWallet}
              className='bg-color-16 h-8 text-[11px] leading-4 font-medium'
            >
              Change Wallet
            </Button>
          </div>
        </div>
      </Condition>
    </div>
  );
}
