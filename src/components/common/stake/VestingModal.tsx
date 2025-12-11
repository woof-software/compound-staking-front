import { useState } from 'react';

import { InfoIcon } from '@/assets/svg';
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
      <div className='mt-8 flex gap-8 flex-col'>
        <Divider />
        <div className='flex'>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be vested
          </Text>
          <div className='flex flex-col items-end'>
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
        <Input
          classNames={{
            input:
              'rounded-lg w-full py-[17px] px-5 bg-color-10 !border !border-solid h-[52px] !border-color-8 !text-13 font-medium leading-[18px]'
          }}
          placeholder='Delegatee name or address'
          value={delegateNameOrAddress}
          onChange={onDelegateNameOrAddressChange}
        />
        <div className='p-5 flex items-center w-full rounded-lg bg-color-26 gap-2.5'>
          <InfoIcon className='text-color-7 size-4' />
          <Text
            size='11'
            lineHeight='16'
            className='text-color-7'
          >
            The whole amount will be added to your Claim balance
          </Text>
        </div>
        <Button className='h-14 rounded-100 text-13 leading-[18px] font-medium'>Confirm</Button>
      </div>
    </Modal>
  );
}
