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
    <div className='mt-10 flex w-full flex-col'>
      {CONNECTORS.map(({ id, title, description, Icon }) => {
        const connector = connectors.find((c) => c.id === id);

        if (!connector) return null;

        return (
          <div
            key={id}
            className='group hover:bg-color-4 flex cursor-pointer items-center gap-3 rounded-lg p-3 opacity-100 data-[disabled=true]:opacity-60'
            onClick={() => onConnectorSelect(connector)}
          >
            <Icon className='size-10 flex-shrink-0 rounded-[5px]' />
            <div className='flex flex-col'>
              <Text
                size='17'
                weight='600'
                lineHeight='20'
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
