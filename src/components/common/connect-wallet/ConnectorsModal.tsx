import { WalletList } from '@/components/common/connect-wallet/WalletList';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { TERMS_URL } from '@/consts/common';
import { noop } from '@/lib/utils/common';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export type ConnectorsModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function ConnectorsModal(props: ConnectorsModalProps) {
  const { isOpen = false, onClose = noop } = props;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <div className='flex flex-col items-center justify-center gap-5'>
        <CompoundBlackCircle className='mt-1 size-16 text-color-4' />
        <div className='flex flex-col gap-1 items-center justify-center'>
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
        </div>
      </div>
      <WalletList onModalClose={onClose} />
      <Text
        size='11'
        weight='500'
        lineHeight='16'
        className='text-color-24 mt-5'
      >
        By connecting, I accept Compound’s{' '}
        <a
          className='text-[11px] font-medium text-color-7 hover:brightness-90'
          href={TERMS_URL}
          target='_blank'
        >
          Terms of Service
        </a>
      </Text>
    </Modal>
  );
}
