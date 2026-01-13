import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

import { ENV } from '@/consts/env';

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask(), walletConnect({ projectId: ENV.WALLET_CONNECT_PROJECT_ID }), coinbaseWallet()],
  transports: {
    [sepolia.id]: http('https://sepolia.drpc.org')
  }
});
