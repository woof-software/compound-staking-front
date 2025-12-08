import { useState } from 'react';

import { Condition } from '@/components/common/Condition';
import { HStack } from '@/components/common/HStack';
import { PasteInputButton } from '@/components/common/PasteInputButton';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';
import { useClipboard } from '@/hooks/useCopyToClipboard';

export type ClaimModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ClaimModal({ isOpen, onClose }: ClaimModalProps) {
  const [delegateNameOrAddress, setDelegateNameOrAddress] = useState<string>('');

  const [isChangeWallet, setIsChangeWallet] = useState<boolean>(false);

  const { pastedText, paste, clearPasted } = useClipboard();

  const onDelegateNameOrAddressChange = (value: string) => {
    setDelegateNameOrAddress(value);

    if (value.length === 0) {
      clearPasted();
    }
  };

  const onClear = () => {
    setDelegateNameOrAddress('');
    clearPasted();
  };

  const onSwitchChange = () => {
    setIsChangeWallet(!isChangeWallet);
    setDelegateNameOrAddress('');
    clearPasted();
  };

  const onPaste = async () => {
    const ok = await paste();
    if (!ok) return;

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
      <VStack
        gap={32}
        className='mt-8'
      >
        <Divider />
        <HStack>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be claimed
          </Text>
          <VStack align='end'>
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
          </VStack>
        </HStack>
        <HStack
          gap={12}
          align='center'
          justify='center'
        >
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
        </HStack>
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
                isPasted={Boolean(pastedText)}
                onPaste={onPaste}
                onClear={onClear}
              />
            }
            value={delegateNameOrAddress}
            onChange={onDelegateNameOrAddressChange}
          />
        </Condition>
        <Button className='h-14 rounded-100 text-13 leading-[18px] font-medium'>Confirm</Button>
      </VStack>
    </Modal>
  );
}
