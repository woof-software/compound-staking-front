import { useAccount } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { ConnectedButton } from '@/components/common/connect-wallet/ConnectedButton';
import { ConnectorsModal } from '@/components/common/connect-wallet/ConnectorsModal';
import { Button } from '@/components/ui/Button';
import { useSwitch } from '@/hooks/useSwitch';

export function WalletButton() {
  const { address } = useAccount();

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  return (
    <>
      <Condition if={!address}>
        <Button
          className='border-2 bg-color-10 rounded-64 text-color-7 border-color-7 max-w-28 text-11 font-medium'
          onClick={onOpen}
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
