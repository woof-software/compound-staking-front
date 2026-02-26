import { type Connector, type CreateConnectorFn, useConnect, useConnectors } from 'wagmi';

import coinbase from '@/assets/coinbase.avif';
import { ArrowIcon } from '@/assets/icons';
import metamask from '@/assets/metamask-and-browsers.avif';
import walletconnect from '@/assets/walletconnect.avif';
import { Condition } from '@/components/common/Condition';
import { cn } from '@/lib/utils/cn';

import { Text } from '../../ui/Text';

const CONNECTORS = [
  {
    id: 'injected',
    title: 'Metamask',
    description: 'And other browser wallets',
    icon: 'metamask-and-browsers'
  },
  {
    id: 'walletConnect',
    title: 'WalletConnect',
    icon: 'walletconnect'
  },
  {
    id: 'coinbaseWalletSDK',
    title: 'Coinbase Wallet',
    icon: 'coinbase'
  }
];

const ICONS: Record<string, string> = {
  'metamask-and-browsers': metamask,
  walletconnect,
  coinbase
};

export const WalletList = (props: { className?: string; onModalClose: () => void }) => {
  const { className, onModalClose } = props;

  const { connect } = useConnect();
  const connectors = useConnectors();

  const onConnectorSelect = (connector: Connector<CreateConnectorFn>) => {
    connect({ connector });

    onModalClose();
  };

  return (
    <div className={cn('my-8 flex w-full flex-col', className)}>
      {CONNECTORS.map(({ id, title, description, icon }) => {
        const connector = connectors.find((c) => c.id === id);

        if (!connector) return null;

        return (
          <div
            key={id}
            className='group hover:bg-color-4 flex cursor-pointer items-center gap-5 rounded-lg p-3 opacity-100 data-[disabled=true]:opacity-60 md:gap-3'
            onClick={() => onConnectorSelect(connector)}
          >
            <img
              src={ICONS[icon]}
              alt='wallet-icon'
              className='size-8 flex-shrink-0 rounded-[8px] md:size-10'
            />
            <div className='flex flex-col'>
              <Text
                size='17'
                weight='600'
                lineHeight='20'
                font='font-grot-disp'
              >
                {title}
              </Text>
              <Condition if={description}>
                <Text
                  size='11'
                  lineHeight='16'
                  className='text-color-24'
                >
                  {description}
                </Text>
              </Condition>
            </div>
            <ArrowIcon className='text-color-2 group-hover:text-color-7 ml-auto size-6 flex-shrink-0' />
          </div>
        );
      })}
    </div>
  );
};
