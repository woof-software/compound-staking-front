import { useEffect, useEffectEvent, useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';

import { CrossIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';
import { Format } from '@/lib/utils/format';
import { useVestingClaim } from '@/pages/stake/hooks/useVestingClaim';
import { useWalletStore } from '@/stores/useWalletStore';

export type ClaimModalProps = {
  isOpen?: boolean;
  totalToClaim?: bigint;
  onClose?: () => void;
  onClaimConfirmed?: () => void;
};

export function ClaimModal(props: ClaimModalProps) {
  const { isOpen = false, totalToClaim = 0n, onClose = noop, onClaimConfirmed = noop } = props;

  const setIsPendingToggle = useWalletStore(({ setIsPendingToggle }) => setIsPendingToggle);

  const { isConnected, address } = useConnection();

  const [walletAddress, setWalletAddress] = useState<string>('');

  const [isChangeWallet, setIsChangeWallet] = useState<boolean>(false);

  const isValidAddress = !isChangeWallet || isAddress(walletAddress);

  const { sendTransactionAsync: claimRequest, data: claimHash, isPending: isClaimPending } = useVestingClaim();

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
  const isVestingLoading = isClaimPending || isClaimConfirming;

  const isClaimButtonDisabled = isLoading || isVestingLoading || !isValidAddress;

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
    <Modal
      title='Claim COMP'
      open={isOpen}
      onClose={onClose}
    >
      <div className='mt-8 flex w-full flex-col gap-8'>
        <Divider orientation='horizontal' />
        <div className='flex'>
          <Text
            size='15'
            lineHeight='20'
            className='w-full'
          >
            Amount to be claimed
          </Text>
          <div className='flex shrink-0 flex-col items-end'>
            <Skeleton loading={isLoading}>
              <Text
                size='15'
                weight='500'
                lineHeight='20'
              >
                {totalToClaim > 0 && '≈'}
                {Format.token(totalClaimFormatted, 'compact', 'COMP')}
              </Text>
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
            Change wallet address
          </Text>
          <Switch
            checked={isChangeWallet}
            onChange={onSwitchChange}
          />
        </div>
        <Condition if={isChangeWallet}>
          <Input
            placeholder='Wallet address'
            value={walletAddress}
            onChange={onWalletAddressChange}
            addonRight={
              <>
                <Condition if={!!walletAddress.length}>
                  <CrossIcon
                    onClick={onClear}
                    className='text-color-25 size-4 shrink-0 cursor-pointer'
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
        </Condition>
        <Button
          className={cn('h-14 flex-col', {
            'bg-color-7': isVestingLoading
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
              'after-animate-loading-dots text-white': isVestingLoading
            })}
          >
            {isVestingLoading ? 'Pending' : 'Confirm'}
          </Text>
        </Button>
      </div>
    </Modal>
  );
}
