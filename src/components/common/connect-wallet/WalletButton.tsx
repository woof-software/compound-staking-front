import { useConnection } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { ConnectedButton } from '@/components/common/connect-wallet/ConnectedButton';
import { ConnectorsModal } from '@/components/common/connect-wallet/ConnectorsModal';
import { Button } from '@/components/ui/Button';
import { useSwitch } from '@/hooks/useSwitch';

export function WalletButton() {
  const { address } = useConnection();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  return (
    <>
      <Condition if={!address}>
        <Button
          className='bg-color-4 rounded-64 text-color-2 border-color-7 w-auto max-w-30.5 border-[0.25px] px-5 py-[13.5px] text-[11px] font-medium'
          onClick={() => {
            onOpen();
            window.location.reload();
          }}
        >
          Connect Wallet
        </Button>
      </Condition>
      <Condition if={address}>
        <ConnectedButton onChangeWallet={onOpen} />
      </Condition>
      <ConnectorsModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
