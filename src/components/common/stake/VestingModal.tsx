import { useState } from 'react';

import { InfoIcon } from '@/assets/svg';
import { HStack } from '@/components/common/HStack';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';

export type VestingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function VestingModal({ isOpen, onClose }: VestingModalProps) {
  const [delegateNameOrAddress, setDelegateNameOrAddress] = useState<string>('');

  const onDelegateNameOrAddressChange = (value: string) => {
    setDelegateNameOrAddress(value);
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
            Amount to be vested
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
        <Input
          allowText
          classNames={{
            input:
              'rounded-lg w-full py-[17px] px-5 bg-color-10 !border !border-solid h-[52px] !border-color-8 !text-13 font-medium leading-[18px]'
          }}
          placeholder='Delegatee name or address'
          value={delegateNameOrAddress}
          onChange={onDelegateNameOrAddressChange}
        />
        <HStack
          align='center'
          className='p-5 w-full rounded-lg bg-color-26 gap-2.5'
        >
          <InfoIcon className='text-color-7 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-7'
          >
            The whole amount will be added to your Claim balance
          </Text>
        </HStack>
        <Button className='h-14 rounded-100 text-13 leading-[18px] font-medium'>Confirm</Button>
      </VStack>
    </Modal>
  );
}
