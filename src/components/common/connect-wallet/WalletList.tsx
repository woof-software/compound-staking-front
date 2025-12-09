import { type Connector, type CreateConnectorFn, useConnect, useConnectors } from 'wagmi';

import { ArrowIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';

import { Text } from '../../ui/Text';

import CoinbaseIcon from '@/assets/coinbase.svg';
import MetaMaskAndBrowsers from '@/assets/metamask-and-browsers.svg';
import WalletConnectIcon from '@/assets/walletconnect.svg';

const CONNECTORS = [
  {
    id: 'metaMaskSDK',
    title: 'MetaMask',
    description: 'and other browser wallets',
    Icon: MetaMaskAndBrowsers
  },
  {
    id: 'walletConnect',
    title: 'WalletConnect',
    Icon: WalletConnectIcon
  },
  {
    id: 'coinbaseWalletSDK',
    title: 'Coinbase Wallet',
    Icon: CoinbaseIcon
  }
];

export const WalletList = ({ onModalClose }: { onModalClose: () => void }) => {
  const { connect } = useConnect();
  const connectors = useConnectors();

  const onConnectorSelect = (connector: Connector<CreateConnectorFn>) => {
    connect({ connector });

    onModalClose();
  };

  return (
    <div className='flex flex-col mt-10 w-full'>
      {CONNECTORS.map(({ id, title, description, Icon }) => {
        const connector = connectors.find((c) => c.id === id);

        if (!connector) return null;

        return (
          <div
            key={id}
            className='flex gap-5 items-center py-4 px-5 rounded-lg group cursor-pointer hover:bg-color-4 opacity-100 data-[disabled=true]:opacity-60'
            onClick={() => onConnectorSelect(connector)}
          >
            <Icon className='size-8 flex-shrink-0' />
            <div className='flex flex-col'>
              <Text
                size='17'
                weight='600'
                lineHeight='20'
                className='text-color-2'
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
            <ArrowIcon className='text-color-25 size-6 flex-shrink-0 ml-auto group-hover:text-color-7' />
          </div>
        );
      })}
    </div>
  );
};
