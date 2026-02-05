import { formatUnits } from 'viem';
import { useConnection } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useUnstakeLockDuration } from '@/hooks/useLockDuration';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useVestingPerUser } from '@/hooks/useVestingPerUser';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format, FormatTime } from '@/lib/utils/format';
import { getAddressContracts } from '@/lib/utils/helpers';
import { useStakedBalance } from '@/pages/stake/hooks/useStakedBalance';
import { useVestingPosition } from '@/pages/stake/hooks/useVestingPosition';

export type UnstakeModalProps = {
  isLoading?: boolean;
  onClick?: () => void;
};

export function UnstakeModal(props: UnstakeModalProps) {
  const { isLoading = false, onClick = noop } = props;

  const { address } = useConnection();

  const { lockManagerAddress } = getAddressContracts(APPLICATION_CHAIN);

  const { data: lockDuration } = useUnstakeLockDuration(APPLICATION_CHAIN, lockManagerAddress);

  const { data: stakedTokenBalance } = useStakedBalance(APPLICATION_CHAIN, address);

  const { data: stakedTokenPriceUsdData } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const { data: maxVestingPositions } = useVestingPerUser(APPLICATION_CHAIN);

  const { data: vestingPositions = [], isLoading: isVestingPositionsLoading } = useVestingPosition(
    APPLICATION_CHAIN,
    address
  );

  const baseTokenPriceFormatted = formatUnits(
    (stakedTokenBalance?.principal ?? 0n) * (stakedTokenPriceUsdData ?? 0n),
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const hasPosition = !!vestingPositions?.length;
  const hasMaxPosition = hasPosition ? vestingPositions?.length === Number(maxVestingPositions ?? 0n) : false;

  const isButtonDisabled = isLoading || isVestingPositionsLoading || hasMaxPosition;

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
            {Format.token(formatUnits(stakedTokenBalance?.principal ?? 0n, ENV.BASE_TOKEN_DECIMALS), 'COMP')}
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
          {FormatTime.cooldownFromSeconds(Number(lockDuration ?? 0n))}
        </Text>
      </div>
      <Condition if={hasMaxPosition}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4 shrink-0' />
          <Text
            size='11'
            lineHeight='16'
            weight='500'
            className='text-color-22'
          >
            You have reached the maximum limit ({maxVestingPositions}) for Vesting entries. You need to close completed
            entries or wait until they are finished
          </Text>
        </div>
      </Condition>
      <Condition if={!hasMaxPosition}>
        <div className='bg-color-21 flex items-center gap-2.5 rounded-lg p-5'>
          <InfoIcon className='text-color-22 size-4 shrink-0' />
          <div>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              All the COMP will be unstaked
            </Text>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              All the rewards get vested
            </Text>
            <Text
              size='11'
              lineHeight='16'
              weight='500'
              className='text-color-22'
            >
              The X.XX% rewards will be gone
            </Text>
          </div>
        </div>
      </Condition>
      <Button
        disabled={isButtonDisabled}
        className={cn('h-14 flex-col', {
          'bg-color-7': isLoading
        })}
        onClick={onClick}
      >
        <Text
          size='13'
          weight='500'
          lineHeight='18'
          className={cn('text-white', {
            'text-color-6': isButtonDisabled,
            'after-animate-loading-dots text-white': isLoading
          })}
        >
          {isLoading ? 'Pending' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
