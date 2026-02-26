import { useEffect, useEffectEvent, useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useConnection, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

import { CrossIcon } from '@/assets/icons';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';
import { APPLICATION_CHAIN } from '@/consts/common';
import { ENV } from '@/consts/env';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useVestingClaim } from '@/pages/stake/hooks/useVestingClaim';
import { useWalletStore } from '@/stores/useWalletStore';

export type ClaimModalProps = {
  totalToClaim?: bigint;
  onClose?: () => void;
  onClaimConfirmed?: () => void;
};

export function ClaimModal(props: ClaimModalProps) {
  const { totalToClaim = 0n, onClose = noop, onClaimConfirmed = noop } = props;

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const { address, isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending: isSwitchPending } = useSwitchChain();

  const [walletAddress, setWalletAddress] = useState<string>('');

  const [isChangeWallet, setIsChangeWallet] = useState<boolean>(false);

  const isValidAddress = !isChangeWallet || isAddress(walletAddress);

  const {
    data: claimHash,
    sendTransactionAsync: claimRequest,
    isPending: isClaimPending
  } = useVestingClaim(APPLICATION_CHAIN);

  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash
  });

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const baseTokenPriceValue = baseTokenPrice ?? 0n;

  const totalClaimFormatted = formatUnits(totalToClaim, ENV.STAKED_TOKEN_DECIMALS);

  const totalClaimPriceFormatted = formatUnits(
    totalToClaim * baseTokenPriceValue,
    ENV.BASE_TOKEN_DECIMALS + ENV.BASE_TOKEN_PRICE_FEED_DECIMALS
  );

  const isLoading = isConnected ? isBaseTokenPriceLoading : false;
  const isClaiming = isSwitchPending || isClaimPending || isClaimConfirming;

  const isClaimButtonDisabled = isLoading || isClaiming || !isValidAddress;

  const isWrongNetwork = isConnected && !!chainId && chainId !== APPLICATION_CHAIN;

  const onWalletAddressChange = (value: string) => {
    setWalletAddress(value);
  };

  const onClear = () => {
    setWalletAddress('');
  };

  const onSwitchChange = () => {
    setIsChangeWallet(!isChangeWallet);
    setWalletAddress('');
  };

  const onPaste = async () => {
    const text = await navigator.clipboard.readText();

    if (!isAddress(text)) return;

    setWalletAddress(text);
  };

  const onConfirm = async () => {
    if (isWrongNetwork) {
      await switchChainAsync({ chainId: APPLICATION_CHAIN });
    }

    if (isAddress(walletAddress)) {
      await claimRequest(walletAddress);
      return;
    }

    if (!address) return;

    await claimRequest(address);
  };

  const onClaimSuccess = useEffectEvent(() => {
    setIsChangeWallet(false);
    setWalletAddress('');

    setIsPendingToggle(false);
    onClose();
    onClaimConfirmed();
  });

  useEffect(() => {
    if (!isClaimSuccess) return;

    onClaimSuccess();
  }, [isClaimSuccess]);

  return (
    <div className='mt-8 flex w-full flex-col gap-8'>
      <Divider orientation='horizontal' />
      <div className='flex'>
        <Text
          size='15'
          lineHeight='20'
          className='w-full'
        >
          Claim amount
        </Text>
        <div className='flex shrink-0 flex-col items-end'>
          <Skeleton loading={isLoading}>
            <div className='flex gap-1'>
              <Condition if={totalToClaim > 0}>
                <Text
                  size='15'
                  weight='500'
                  lineHeight='20'
                >
                  ≈
                </Text>
              </Condition>
              <Text
                size='15'
                weight='500'
                lineHeight='20'
              >
                {Format.token(totalClaimFormatted, { symbol: 'COMP' })}
              </Text>
            </div>
          </Skeleton>
          <Skeleton loading={isLoading}>
            <Text
              size='11'
              lineHeight='16'
              className='text-color-24'
            >
              {Format.price(totalClaimPriceFormatted, 'standard')}
            </Text>
          </Skeleton>
        </div>
      </div>
      <div className='flex items-center justify-center gap-3'>
        <Text
          size='11'
          weight='500'
          className='text-color-24'
        >
          Recipient wallet
        </Text>
        <Switch
          checked={isChangeWallet}
          onChange={onSwitchChange}
        />
      </div>
      <Condition if={isChangeWallet}>
        <div>
          <Input
            className={cn({
              'border-color-31': walletAddress && !isAddress(walletAddress)
            })}
            placeholder='Enter wallet address'
            value={walletAddress}
            onChange={onWalletAddressChange}
            addonRight={
              <>
                <Condition if={walletAddress.length}>
                  <CrossIcon
                    onClick={onClear}
                    className='text-color-25 size-6 shrink-0 cursor-pointer'
                  />
                </Condition>
                <Condition if={!walletAddress.length}>
                  <Button
                    onClick={onPaste}
                    className='bg-color-9 !text-color-24 h-8 w-13 rounded-4xl text-[11px] font-medium'
                  >
                    Paste
                  </Button>
                </Condition>
              </>
            }
          />
          <Condition if={walletAddress && !isAddress(walletAddress)}>
            <Text
              size='11'
              weight='500'
              lineHeight='16'
              className='text-color-31 mt-2.5'
            >
              Invalid wallet address
            </Text>
          </Condition>
        </div>
      </Condition>
      <Button
        className={cn('h-14 w-full flex-col', {
          'bg-color-7': isClaiming
        })}
        disabled={isClaimButtonDisabled}
        onClick={onConfirm}
      >
        <Text
          size='13'
          weight='500'
          lineHeight='18'
          className={cn('text-white', {
            'text-color-6': isClaimButtonDisabled,
            'after-animate-loading-dots text-white': isClaiming
          })}
        >
          {isClaiming ? 'Pending' : 'Confirm'}
        </Text>
      </Button>
    </div>
  );
}
