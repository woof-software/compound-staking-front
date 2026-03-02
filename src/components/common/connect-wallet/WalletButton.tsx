import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { DesktopConnectedButton } from '@/components/common/connect-wallet/ConnectedButton/DesktopConnectedButton';
import { MobileConnectedButton } from '@/components/common/connect-wallet/ConnectedButton/MobileConnectedButton';
import { ConnectorsModal } from '@/components/common/connect-wallet/ConnectorsModal';
import { Button } from '@/components/ui/Button';
import { useSwitch } from '@/hooks/useSwitch';

import Wallet from '@/assets/svg/wallet.svg';

export function WalletButton() {
  const { address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  return (
    <>
      <Condition if={!address}>
        <Button
          className='bg-color-4 rounded-64 text-color-2 border-color-7 w-auto max-w-30.5 border-[0.25px] px-5 py-[13.5px] text-[11px] font-medium'
          onClick={() => window.location.reload()}
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
        <DesktopConnectedButton onChangeWallet={onOpen} />
        <MobileConnectedButton onChangeWallet={onOpen} />
      </Condition>
      <ConnectorsModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
