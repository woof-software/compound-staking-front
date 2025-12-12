import { useState } from 'react';
import { isAddress } from 'viem';

import { CrossIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';
import { noop } from '@/lib/utils/common';
import { addressRegex } from '@/lib/utils/regex';

export type ClaimModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ClaimModal({ isOpen = false, onClose = noop }: ClaimModalProps) {
  const [delegateNameOrAddress, setDelegateNameOrAddress] = useState<string>('');

  const [isChangeWallet, setIsChangeWallet] = useState<boolean>(false);

  const isValidAddress = !isChangeWallet || isAddress(delegateNameOrAddress);

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
    const text = await navigator.clipboard.readText();

    const m = addressRegex.exec(text);

    if (m === null || m[0] !== text) return;

    setDelegateNameOrAddress(text ?? '');
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
            placeholder='Delegator name or address'
            value={delegateNameOrAddress}
            onChange={onDelegateNameOrAddressChange}
            addonRight={
              <>
                <Condition if={!!delegateNameOrAddress.length}>
                  <CrossIcon
                    onClick={onClear}
                    className='size-4 shrink-0 text-color-25 cursor-pointer'
                  />
                </Condition>
                <Condition if={!delegateNameOrAddress.length}>
                  <Button
                    onClick={onPaste}
                    className='bg-color-9 rounded-4xl w-13 h-8 !text-color-24 text-[11px] font-medium'
                  >
                    Paste
                  </Button>
                </Condition>
              </>
            }
          />
        </Condition>
        <Button
          disabled={!isValidAddress}
          className='h-14 rounded-100 text-[13px] fs leading-[18px] font-medium'
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
