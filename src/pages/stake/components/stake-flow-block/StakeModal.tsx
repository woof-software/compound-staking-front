import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { DelegateSelector } from '@/components/common/stake/DelegateSelector';
import { AmountInput } from '@/components/ui/AmountInput';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { type Delegate } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';

import COMP from '@/assets/comp.svg';

export type StakeModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function StakeModal(props: StakeModalProps) {
  const { isOpen = false, onClose = noop } = props;

  const { address } = useConnection();

  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedAddressDelegate, setSelectedAddressDelegate] = useState<Delegate | null>(null);

  const { data: compPriceUsdData } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);
  const { data: compWalletBalanceData } = useTokenBalance(address, ENV.BASE_TOKEN_ADDRESS);

  const compPriceUsdValue = compPriceUsdData ?? 0n;
  const compWalletBalanceValue = compWalletBalanceData ?? 0n;

  const parseAmountValue = parseUnits(amountValue, ENV.BASE_TOKEN_DECIMALS);

  const inputValueInCOMP = formatUnits(
    parseAmountValue * compPriceUsdValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );
  const compWalletBalance = formatUnits(compWalletBalanceValue, ENV.BASE_TOKEN_DECIMALS);

  const formatCOMPPrice = Format.price(inputValueInCOMP, 'standard');
  const formatCOMPWalletBalance = Format.token(compWalletBalance, 'standard');

  const isAdditionalStake = false; //Variable for additional stake condition

  const onMaxButtonClick = () => {
    setAmountValue(compWalletBalance);
  };

  const onDelegateSelect = (address: Delegate | null) => {
    setSelectedAddressDelegate(address);
  };

  return (
    <Modal
      title='Stake COMP tokens'
      open={isOpen}
      onClose={onClose}
    >
      <div className='mt-8 w-full flex flex-col gap-8'>
        <Divider orientation='horizontal' />
        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between gap-5'>
            <div className='flex items-center gap-2 max-w-72'>
              <COMP className='size-6.75 shrink-0' />
              <AmountInput
                className='max-w-60 min-h-12'
                value={amountValue}
                onChange={setAmountValue}
              />
            </div>
            <Button
              className='bg-color-16 h-8 text-[11px] font-medium w-14'
              onClick={onMaxButtonClick}
            >
              Max
            </Button>
          </div>
          <div className='flex w-full items-center justify-between'>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {formatCOMPPrice}
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {formatCOMPWalletBalance} COMP
            </Text>
          </div>
        </div>
        <DelegateSelector
          selectedAddressDelegate={selectedAddressDelegate}
          onSelect={onDelegateSelect}
        />
        <Condition if={isAdditionalStake}>
          <div className='bg-color-21 rounded-lg p-5 flex items-center gap-2.5'>
            <InfoIcon className='size-4 text-color-22' />
            <Text
              size='11'
              lineHeight='16'
              className='text-color-22'
            >
              Multiplier reverts to 1x after staking more COMP. All available rewards get vested.
            </Text>
          </div>
        </Condition>
        <div className='flex flex-col gap-2.5'>
          <Button
            className={cn('flex-col h-14')}
            disabled={true}
          >
            <Text
              size='13'
              weight='500'
              lineHeight='18'
              className={cn('text-color-6', {
                'text-white': false //disabled state
              })}
            >
              Approve
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className={cn('text-color-6', {
                'text-white': false //disabled state
              })}
            >
              Step 1
            </Text>
          </Button>
          <Button
            className={cn('flex-col h-14')}
            disabled={true}
          >
            <Text
              size='13'
              weight='500'
              lineHeight='18'
              className={cn('text-color-6', {
                'text-white': false //disabled state
              })}
            >
              Confirm
            </Text>
            <Text
              size='11'
              lineHeight='16'
              className={cn('text-color-6', {
                'text-white': false //disabled state
              })}
            >
              Step 2
            </Text>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
