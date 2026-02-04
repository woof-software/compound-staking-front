import { useEffect } from 'react';
import { useConnection, useSwitchChain } from 'wagmi';

import { CloseIcon } from '@/assets/svg';
import { Portal } from '@/components/common/Portal';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { cn } from '@/lib/utils/cn';
import { getChainLogo, getChainName } from '@/lib/utils/helpers';
import { useSwitchNetworkModalStore } from '@/stores/useSwitchNetworkModalStore';

export function SwitchNetworkModal() {
  const { isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending } = useSwitchChain();

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
        <div className='bg-color-5 modal-content-in relative flex w-full max-w-105 flex-col items-center rounded-lg p-10'>
          <div className='flex w-full items-center justify-end'>
            <Text
              tag='h4'
              size='17'
              lineHeight='20'
              align='center'
              weight='600'
              font='font-grot-disp'
              className='ml-5 w-full'
            >
              Confirm Network Switch
            </Text>
            <Button
              onClick={close}
              className='size-auto bg-transparent p-0'
            >
              <CloseIcon className='text-color-18 ml-auto size-6 cursor-pointer' />
            </Button>
          </div>
          <div className='mt-10 mb-5 flex items-center justify-center gap-3'>
            <img
              src={getChainLogo(chainId)}
              alt='chain-logo'
              className='size-12 rounded-full'
            />
            <div className='chain-slide inline-block size-6 shrink-0' />
            <img
              src={getChainLogo(APPLICATION_CHAIN)}
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
            className={cn('rounded-100 bg-color-16 mt-10 h-[57px] text-[13px] font-medium', {
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
