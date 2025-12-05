import { useAccount } from 'wagmi';

import { Condition } from '@/components/common/Condition';
import { HStack } from '@/components/common/HStack';
import { Text } from '@/components/ui/Text';
import { useErc20Balance } from '@/hooks/useErc20Balance';
import { sliceAddress } from '@/lib/utils/common';

import CompoundWalletIcon from '@/assets/compound-wallet-icon.svg';

export function ConnectedButton() {
  const { address } = useAccount();

  const { compWalletBalance } = useErc20Balance();

  const walletBalance = compWalletBalance.toString().split('.');

  return (
    <HStack
      justify='end'
      className='h-11 cursor-pointer rounded-64 bg-color-11 max-w-fit shadow-20'
    >
      <HStack
        align='center'
        justify='center'
        gap={8}
        className='bg-color-11 rounded-64 h-11 max-w-[118px] py-2 px-3'
      >
        <CompoundWalletIcon className='size-4 flex-shrink-0' />
        <Text
          size='11'
          weight='500'
          lineHeight='16'
          className='text-color-2'
        >
          {walletBalance[0]}
          <Condition if={Boolean(walletBalance[1])}>
            <Text
              tag='span'
              size='11'
              weight='500'
              lineHeight='16'
              className='text-color-24'
            >
              .{walletBalance[1]}
            </Text>
          </Condition>
        </Text>
      </HStack>
      <HStack
        align='center'
        justify='center'
        gap={8}
        className='bg-color-4 rounded-64 h-11 min-w-[118px] shadow-20 max-w-[118px] py-2 px-3'
      >
        <div className='size-2 rounded-full bg-color-7' />
        <Text
          size='11'
          weight='500'
          lineHeight='16'
          className='text-color-2'
        >
          {sliceAddress(address as string)}
        </Text>
      </HStack>
      {/*<HStack*/}
      {/*  gap={8}*/}
      {/*  align='center'*/}
      {/*  justify='center'*/}
      {/*  className='min-w-[100px] h-11 bg-color-7 rounded-64'*/}
      {/*>*/}
      {/*  <Spinner className='animate-spin size-4 flex-shrink-0' />*/}
      {/*  <Text*/}
      {/*    size='11'*/}
      {/*    weight='500'*/}
      {/*    lineHeight='16'*/}
      {/*    className='text-white'*/}
      {/*  >*/}
      {/*    1 Pending*/}
      {/*  </Text>*/}
      {/*</HStack>*/}
    </HStack>
  );
}
