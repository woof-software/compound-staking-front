import { Condition } from '@/components/common/Condition';
import { WalletList } from '@/components/common/connect-wallet/WalletList';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { TERMS_URL } from '@/consts/common';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { noop } from '@/lib/utils/common';

import CompoundBlackCircle from '@/assets/compound-black-circle.svg';

export type ConnectorsModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function ConnectorsModal(props: ConnectorsModalProps) {
  const { isOpen = false, onClose = noop } = props;

  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <>
      <Condition if={!isMobile}>
        <Modal
          open={isOpen}
          onClose={onClose}
        >
          <div className='flex flex-col items-center justify-center gap-5'>
            <CompoundBlackCircle className='text-color-4 size-16' />
            <div className='flex flex-col items-center justify-center'>
              <Text
                tag='h2'
                size='21'
                weight='600'
                lineHeight='24'
                font='font-grot-disp'
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
            className='text-color-24'
          >
            By connecting, I accept Compound’s{' '}
            <a
              className='text-color-7 text-[11px] font-medium'
              href={TERMS_URL}
              target='_blank'
            >
              Terms of Service
            </a>
          </Text>
        </Modal>
      </Condition>
      <Condition if={isMobile}>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
        >
          <div className='flex flex-col items-center justify-center gap-5'>
            <CompoundBlackCircle className='text-color-4 size-16' />
            <div className='flex flex-col items-center justify-center gap-1'>
              <Text
                tag='h2'
                size='21'
                weight='600'
                lineHeight='24'
                font='font-grot-disp'
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
          <WalletList
            className='mt-10 mb-5'
            onModalClose={onClose}
          />
          <Text
            size='11'
            weight='500'
            lineHeight='16'
            align='center'
            className='text-color-24'
          >
            By connecting, I accept Compound’s{' '}
            <a
              className='text-color-7 text-[11px] font-medium'
              href={TERMS_URL}
              target='_blank'
            >
              Terms of Service
            </a>
          </Text>
        </Drawer>
      </Condition>
    </>
  );
}
