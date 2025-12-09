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
      <div className='mt-8 flex flex-col gap-8'>
        <Divider />
        <div className='flex'>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be claimed
          </Text>
          <div className='flex items-end'>
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
            allowText
            classNames={{
              input:
                'rounded-lg w-full py-[17px] px-5 pr-[70px] bg-color-10 !border !border-solid h-[52px] !border-color-8 !text-13 font-medium leading-[18px]'
            }}
            placeholder='Delegatee name or address'
            addonRight={
              <PasteInputButton
                isPasted={Boolean(delegateNameOrAddress.length)}
                onPaste={onPaste}
                onClear={onClear}
              />
            }
            value={delegateNameOrAddress}
            onChange={onDelegateNameOrAddressChange}
          />
        </Condition>
        <Button className='h-14 rounded-100 text-13 leading-[18px] font-medium'>Confirm</Button>
      </div>
    </Modal>
  );
}
