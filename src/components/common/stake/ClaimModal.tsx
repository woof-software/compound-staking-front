import { useState } from 'react';

import { Condition } from '@/components/common/Condition';
import { PasteInputButton } from '@/components/common/PasteInputButton';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';

export type ClaimModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ClaimModal({ isOpen, onClose }: ClaimModalProps) {
  const [delegateNameOrAddress, setDelegateNameOrAddress] = useState<string>('');

  const [isChangeWallet, setIsChangeWallet] = useState<boolean>(false);

  const onDelegateNameOrAddressChange = (value: string) => {
    setDelegateNameOrAddress(value);
  };

  const onClear = () => {
    setDelegateNameOrAddress('');
  };

  const onSwitchChange = () => {
    setIsChangeWallet(!isChangeWallet);
    setDelegateNameOrAddress('');
  };

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDelegateNameOrAddress(text ?? '');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      title='Vesting'
      open={isOpen}
      onClose={onClose}
    >
      <div className='w-full mt-8 flex flex-col gap-8'>
        <Divider />
        <div className='flex'>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be claimed
          </Text>
          <div className='flex flex-col shrink-0 items-end'>
            <Text
              size='15'
              weight='500'
              lineHeight='20'
            >
              1.0000 COMP
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              $40.00
            </Text>
          </div>
        </div>
        <div className='items-center justify-center gap-3 flex'>
          <Text
            size='11'
            weight='500'
            className='text-color-24'
          >
            Change wallet address
          </Text>
          <Switch
            checked={isChangeWallet}
            onChange={onSwitchChange}
          />
        </div>
        <Condition if={isChangeWallet}>
          <Input
            placeholder='Delegatee name or address'
            value={delegateNameOrAddress}
            onChange={onDelegateNameOrAddressChange}
            addonRight={
              <PasteInputButton
                isPasted={Boolean(delegateNameOrAddress.length)}
                onPaste={onPaste}
                onClear={onClear}
              />
            }
          />
        </Condition>
        <Button className='h-14 rounded-100 text-13 leading-[18px] font-medium'>Confirm</Button>
      </div>
    </Modal>
  );
}
