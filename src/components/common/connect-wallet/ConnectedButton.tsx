import { useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { HStack } from '@/components/common/HStack';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useErc20Balance } from '@/hooks/useErc20Balance';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { useWalletStore } from '@/hooks/useWallet';
import { sliceAddress } from '@/lib/utils/common';

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

  const walletBalance = compWalletBalance.toString().split('.');

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
      <HStack
        onClick={onOpen}
        justify='end'
        className='h-11 cursor-pointer rounded-64 bg-color-11 max-w-fit shadow-20'
      >
        <HStack
          align='center'
          justify='center'
          gap={8}
          className='bg-color-11 rounded-64 h-11 max-w-[118px] py-2 px-3'
        >
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
        </HStack>
        <Condition if={!isPending}>
          <HStack
            align='center'
            justify='center'
            gap={8}
            className='bg-color-4 rounded-64 h-11 min-w-[118px] shadow-20 max-w-[118px] py-2 px-3'
          >
            <div className='size-2 rounded-full bg-color-7' />
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-color-2'
            >
              {sliceAddress(address as string)}
            </Text>
          </HStack>
        </Condition>
        <Condition if={isPending}>
          <HStack
            gap={8}
            align='center'
            justify='center'
            className='min-w-[100px] h-11 bg-color-7 rounded-64'
          >
            <Spinner className='animate-spin size-4 flex-shrink-0' />
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-white'
            >
              1 Pending
            </Text>
          </HStack>
        </Condition>
      </HStack>
      <Condition if={isOpen}>
        <VStack
          ref={ref}
          gap={12}
          className='absolute min-w-[256px] top-12 right-0 h-auto bg-color-10 rounded-2xl p-5'
        >
          <HStack gap={8}>
            <HStack
              align='center'
              justify='start'
              gap={8}
            >
              <div className='size-2 rounded-full bg-color-7' />
              <Text
                size='13'
                weight='500'
                lineHeight='18'
                className='text-color-2'
              >
                {sliceAddress(address as string)}
              </Text>
            </HStack>
            <CopyIcon
              onClick={onAddressCopy}
              className='text-color-2 size-4 cursor-pointer hover:brightness-90 hover:text-color-7 transition-all duration-200'
            />
          </HStack>
          <VStack gap={8}>
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
          </VStack>
        </VStack>
      </Condition>
    </div>
  );
}
