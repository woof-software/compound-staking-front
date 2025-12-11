import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { useChainLogo, useChainName } from '@/hooks/useChain';

export function SwitchNetworkModal() {
  const chainName = useChainName();
  const chainLogo = useChainLogo();

  return (
    <Modal
      title='Confirm Network Switch'
      open={true}
    >
      <div className='mt-10 mb-5 flex items-center justify-center gap-2.5'>
        <img
          src={chainLogo}
          alt='chain-logo'
          className='size-16 rounded-full'
        />
        <div className='chain-slide shrink-0 inline-block size-6' />
        <img
          src='/assets/chains/1.svg'
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
        Your wallet is currently connected to the {chainName} network. Please switch your wallet to Ethereum to
        complete.
      </Text>
      <Button className='rounded-100 h-14 mt-15 bg-color-16 font-medium text-13'>Switch Network</Button>
    </Modal>
  );
}
