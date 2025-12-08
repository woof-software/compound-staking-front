import { useAccount, useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { HStack } from '@/components/common/HStack';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { getChainIcon } from '@/lib/utils/assets';

export type SwitchNetworkModalProps = {
  isOpen: boolean;
};

export function SwitchNetworkModal({ isOpen }: SwitchNetworkModalProps) {
  const { isConnected, chainId } = useAccount();

  const { switchChain } = useSwitchChain();

  const onSwitchToEthereum = () => {
    if (!isConnected) return;
    switchChain({ chainId: mainnet.id });
  };

  return (
    <Modal
      title='Confirm Network Switch'
      open={isOpen}
    >
      <HStack
        gap={10}
        align='center'
        justify='center'
        className='mt-10 mb-5'
      >
        {getChainIcon(chainId, 'size-16 rounded-full').icon}
        <div className='chain-slide shrink-0 inline-block size-6' />
        {getChainIcon(mainnet.id, 'size-16 rounded-full').icon}
      </HStack>
      <Text
        size='13'
        align='center'
        lineHeight='18'
        className='mt-5 max-w-[300px]'
      >
        Your wallet is currently connected to the Arbitrum network. Please switch your wallet to Ethereum to complete
        the transaction,
      </Text>
      <Button
        onClick={onSwitchToEthereum}
        className='rounded-100 h-14 mt-15 bg-color-16 font-medium text-13'
      >
        Switch Network
      </Button>
    </Modal>
  );
}
