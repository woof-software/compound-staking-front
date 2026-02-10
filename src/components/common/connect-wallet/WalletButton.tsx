import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { ConnectedButton } from '@/components/common/connect-wallet/ConnectedButton';
import { ConnectedButtonMobile } from '@/components/common/connect-wallet/ConnectedButtonMobile';
import { ConnectorsModal } from '@/components/common/connect-wallet/ConnectorsModal';
import { Button } from '@/components/ui/Button';
import { useSwitch } from '@/hooks/useSwitch';

import Wallet from '@/assets/wallet.svg';

export function WalletButton() {
  const { address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  return (
    <>
      <Condition if={!address}>
        <Button
          className='bg-color-4 rounded-64 text-color-2 border-color-7 hidden w-auto max-w-30.5 border-[0.25px] px-5 py-[13.5px] text-[11px] font-medium md:block'
          onClick={onOpen}
        >
          Connect Wallet
        </Button>
        <Button
          onClick={onOpen}
          className='bg-color-9 relative block h-11 w-11 rounded-full md:hidden'
        >
          <Wallet
            width='16'
            height='16'
          />
          <div className='bg-color-24 border-color-1 absolute right-0 -bottom-[1px] h-4 w-4 rounded-full border-3' />
        </Button>
      </Condition>
      <Condition if={address}>
        <ConnectedButton onChangeWallet={onOpen} />
        <ConnectedButtonMobile onChangeWallet={onOpen} />
      </Condition>
      <ConnectorsModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
