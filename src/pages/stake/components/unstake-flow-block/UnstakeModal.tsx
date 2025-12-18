import { formatUnits } from 'viem';

import { InfoIcon } from '@/assets/svg';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { noop } from '@/lib/utils/common';
import { Format, FormatTime } from '@/lib/utils/format';

export type UnstakeModalProps = {
  isLoading?: boolean;
  lockDuration?: number;
  baseTokenPriceUsdData?: bigint | undefined;
  baseTokenBalance?: bigint | undefined;
  onClick?: () => void;
};

export function UnstakeModal(props: UnstakeModalProps) {
  const {
    isLoading = false,
    lockDuration = 0,
    baseTokenBalance = undefined,
    baseTokenPriceUsdData = undefined,
    onClick = noop
  } = props;

  const baseTokenPriceFormatted = formatUnits(
    BigInt(baseTokenBalance ?? 0) * BigInt(baseTokenPriceUsdData ?? 0),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex justify-between'>
        <Text
          size='15'
          lineHeight='20'
        >
          Unstaked amount
        </Text>
        <div className='flex flex-col items-end'>
          <Text
            size='15'
            weight='500'
            lineHeight='20'
          >
            {Format.token(formatUnits(BigInt(baseTokenBalance ?? 0), ENV.BASE_TOKEN_DECIMALS), 'compact')} COMP
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-24'
          >
            {Format.price(baseTokenPriceFormatted, 'standard')}
          </Text>
        </div>
      </div>
      <div className='flex justify-between'>
        <Text
          size='15'
          lineHeight='20'
        >
          Cooldown
        </Text>
        <Text
          size='15'
          weight='500'
          lineHeight='20'
        >
          {FormatTime.cooldownFromSeconds(lockDuration)}
        </Text>
      </div>
      <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
        <InfoIcon className='text-color-22' />
        <div>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            All the COMP will be unstaked.
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            All the rewards get vested.
          </Text>
          <Text
            size='11'
            lineHeight='16'
            className='text-color-22'
          >
            The X.XX% rewards will be gone.
          </Text>
        </div>
      </div>
      <Button
        className='h-14 text-[13px] font-medium'
        onClick={onClick}
      >
        {isLoading ? 'Pending...' : 'Confirm'}
      </Button>
    </div>
  );
}
