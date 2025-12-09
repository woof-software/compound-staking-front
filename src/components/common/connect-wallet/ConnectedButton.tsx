import { useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useErc20Balance } from '@/hooks/useErc20Balance';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { useWalletStore } from '@/hooks/useWallet';
import { sliceAddress } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';

import CompoundWalletIcon from '@/assets/compound-wallet-icon.svg';
import Spinner from '@/assets/spinner.svg';

export type ConnectedButtonProps = {
  onChangeWallet: () => void;
};

export function ConnectedButton({ onChangeWallet: onWalletChange }: ConnectedButtonProps) {
  const ref = useRef(null);

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { compWalletBalance } = useErc20Balance();
  const { isPending } = useWalletStore();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const [, onAddressTextCopy] = useCopyToClipboard();

  const walletBalance = Format.token(compWalletBalance).split('.');

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
    await onAddressTextCopy(address!);
  };

  useOnClickOutside(ref, onClose);

  return (
    <div className='relative'>
      <div
        onClick={onOpen}
        className='h-11 flex flex-col justify-end cursor-pointer rounded-64 bg-color-11 max-w-fit shadow-20'
      >
        <div className='bg-color-11 gap-2 flex flex-col items-center justify-center rounded-64 h-11 max-w-29.5 py-2 px-3'>
          <CompoundWalletIcon className='size-4 flex-shrink-0' />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            className='text-color-2'
          >
            {walletBalance[0]}
            <Condition if={Boolean(walletBalance[1])}>
              <Text
                tag='span'
                size='11'
                weight='500'
                lineHeight='16'
                className='text-color-24'
              >
                .{walletBalance[1]}
              </Text>
            </Condition>
          </Text>
        </div>
        <Condition if={!isPending}>
          <div className='bg-color-4 flex flex-col justify-center items-center gap-2 rounded-64 h-11 w-29.5 shadow-20 py-2 px-3'>
            <div className='size-2 rounded-full bg-color-7' />
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-color-2'
            >
              {sliceAddress(address!)}
            </Text>
          </div>
        </Condition>
        <Condition if={isPending}>
          <div className='min-w-25 flex flex-col justify-center items-center gap-2 h-11 bg-color-7 rounded-64'>
            <Spinner className='animate-spin size-4 flex-shrink-0' />
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
          className='absolute flex gap-3 min-w-64 top-12 right-0 h-auto bg-color-10 rounded-2xl p-5'
        >
          <div className='flex flex-col gap-2'>
            <div className='items-center justify-start gap-2 flex'>
              <div className='size-2 rounded-full bg-color-7' />
              <Text
                size='13'
                weight='500'
                lineHeight='18'
                className='text-color-2'
              >
                {sliceAddress(address!)}
              </Text>
            </div>
            <CopyIcon
              onClick={onAddressCopy}
              className='text-color-2 size-4 cursor-pointer hover:brightness-90 hover:text-color-7 transition-all duration-200'
            />
          </div>
          <div className='gap-2 flex'>
            <Button
              onClick={onDisconnect}
              className='text-[11px] bg-color-16 font-medium leading-4 h-8'
            >
              Disconnect
            </Button>
            <Button
              onClick={onChangeWallet}
              className='text-[11px] bg-color-16 font-medium leading-4 h-8'
            >
              Change Wallet
            </Button>
          </div>
        </div>
      </Condition>
    </div>
  );
}
