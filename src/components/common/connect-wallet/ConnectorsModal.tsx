import { WalletList } from '@/components/common/connect-wallet/WalletList';
import { VStack } from '@/components/common/VStack';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { TERMS_URL } from '@/consts/common';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export type ConnectorsModalProps = {
  isOpen: boolean;

  onClose: () => void;
};

export default function ConnectorsModal({ isOpen, onClose }: ConnectorsModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <VStack
        gap={20}
        align='center'
        justify='center'
      >
        <CompoundBlackCircle className='mt-1 size-16 text-color-4' />
        <VStack
          gap={4}
          align='center'
          justify='center'
        >
          <Text
            size='21'
            weight='600'
            lineHeight='24'
            className='text-color-2'
          >
            Connect Wallet
          </Text>
          <Text
            size='15'
            lineHeight='20'
            className='text-color-24'
          >
            To start using Compound
          </Text>
        </VStack>
      </VStack>
      <WalletList onModalClose={onClose} />
      <Text
        size='11'
        weight='500'
        lineHeight='16'
        className='text-color-24 mt-5'
      >
        By connecting, I accept Compound’s{' '}
        <a
          className='text-11 font-medium text-color-7 hover:brightness-90'
          href={TERMS_URL}
          target='_blank'
          rel='noreferrer'
        >
          Terms of Service
        </a>
      </Text>
    </Modal>
  );
}
