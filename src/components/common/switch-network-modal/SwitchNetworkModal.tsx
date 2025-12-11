import { useChainId } from 'wagmi';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { getChainLogo, getChainName } from '@/lib/utils/helpers';

export function SwitchNetworkModal() {
  const chainId = useChainId();

  return (
    <Modal
      title='Confirm Network Switch'
      open={false}
    >
      <div className='mt-10 mb-5 flex items-center justify-center gap-2.5'>
        <img
          src={getChainLogo(chainId)}
          alt='chain-logo'
          className='size-16 rounded-full'
        />
        <div className='chain-slide shrink-0 inline-block size-6' />
        <img
          src={getChainLogo(1)}
          alt='chain-logo'
          className='size-16 rounded-full'
        />
      </div>
      <Text
        size='13'
        align='center'
        lineHeight='18'
        className='text-color-2 mt-5 max-w-[300px]'
      >
        Your wallet is currently connected to the {getChainName(chainId)} network. Please switch your wallet to Ethereum
        to complete.
      </Text>
      <Button className='rounded-100 h-14 mt-15 bg-color-16 font-medium text-13'>Switch Network</Button>
    </Modal>
  );
}
