import { useEffect } from 'react';
import { useConnection, useSwitchChain } from 'wagmi';

import { CloseIcon } from '@/assets/icons';
import { Button } from '@/components/ui/Button';
import { Portal } from '@/components/ui/Portal';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { useThemeStore } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/cn';
import { getChainLogo, getChainName } from '@/lib/utils/helpers';
import { useSwitchNetworkModalStore } from '@/stores/useSwitchNetworkModalStore';

export function SwitchNetworkModal() {
  const { isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending } = useSwitchChain();

  const { theme } = useThemeStore();

  const isOpen = useSwitchNetworkModalStore(({ isOpen }) => isOpen);
  const close = useSwitchNetworkModalStore(({ close }) => close);

  const isWrongNetwork = isConnected && !!chainId && chainId !== APPLICATION_CHAIN;

  const open = isOpen && isWrongNetwork;

  const onSwitch = async () => {
    await switchChainAsync({ chainId: APPLICATION_CHAIN });
    close();
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('disable-scroll-vertical');
    }

    return () => {
      document.body.classList.remove('disable-scroll-vertical');
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className='modal-fade-in bg-modal-bg fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[7.5px]'
        onPointerDown={(e) => {
          if (!close) return;
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className='bg-color-5 modal-content-in w-[calc(100% - 16px)] absolute bottom-2 mx-2 flex max-w-full flex-col items-center rounded-lg p-10 md:relative md:mx-0 md:w-full md:max-w-105'>
          <div className='flex w-full items-center justify-end'>
            <Text
              tag='h4'
              size='17'
              lineHeight='20'
              align='center'
              weight='600'
              font='font-grot-disp'
              className='w-full md:mr-4 md:ml-10'
            >
              Confirm Network Switch
            </Text>
            <Button
              onClick={close}
              className='hidden size-auto bg-transparent p-0 md:block'
            >
              <CloseIcon className='text-color-18 ml-auto size-6 cursor-pointer' />
            </Button>
          </div>
          <div className='mt-10 mb-5 flex items-center justify-center gap-3'>
            <img
              src={getChainLogo(chainId, theme)}
              alt='chain-logo'
              className='size-12 rounded-full'
            />
            <div className='chain-slide inline-block size-6 shrink-0' />
            <img
              src={getChainLogo(APPLICATION_CHAIN, theme)}
              alt='chain-logo'
              className='size-12 rounded-full'
            />
          </div>
          <Text
            size='13'
            align='center'
            lineHeight='18'
            className='text-color-2'
          >
            Your wallet is currently connected to the {getChainName(chainId)} network. Please switch your wallet over to{' '}
            {getChainName(APPLICATION_CHAIN)} to complete the transaction.
          </Text>
          <Button
            disabled={isPending}
            onClick={onSwitch}
            className={cn('rounded-100 bg-color-7 mt-10 h-[57px] text-[13px] font-medium', {
              'after-animate-loading-dots': isPending
            })}
          >
            {isPending ? 'Switching' : 'Switch Network'}
          </Button>
        </div>
      </div>
    </Portal>
  );
}
