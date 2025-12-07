import { createConfig, http, injected } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

import { WALLET_CONNECT_PROJECT_ID } from '@/consts/common';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask(), walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID }), coinbaseWallet()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
});
