import { useConnection, useSwitchChain } from 'wagmi';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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

  const onSwitch = async () => {
    await switchChainAsync({ chainId: APPLICATION_CHAIN });
    close();
  };

  return (
    <Modal
      title='Confirm Network Switch'
      open={isOpen && isWrongNetwork}
      onClose={close}
    >
      <div className='mt-10 mb-5 flex items-center justify-center gap-2.5'>
        <img
          src={getChainLogo(chainId)}
          alt='chain-logo'
          className='size-16 rounded-full'
        />
        <div className='chain-slide inline-block size-6 shrink-0' />
        <img
          src={getChainLogo(APPLICATION_CHAIN)}
          alt='chain-logo'
          className='size-16 rounded-full'
        />
      </div>
      <Text
        size='13'
        align='center'
        lineHeight='18'
        className='text-color-2 mt-5 max-w-75'
      >
        Your wallet is currently connected to the {getChainName(chainId)} network. Please switch your wallet to{' '}
        {getChainName(APPLICATION_CHAIN)} to complete.
      </Text>
      <Button
        disabled={isPending}
        onClick={onSwitch}
        className={cn('rounded-100 bg-color-16 mt-15 h-14 text-[13px] font-medium', {
          'after-animate-loading-dots': isPending
        })}
      >
        {isPending ? 'Switching' : 'Switch Network'}
      </Button>
    </Modal>
  );
}
