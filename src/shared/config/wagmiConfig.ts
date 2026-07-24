import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { ENV } from '@/consts/env';

const rpc = `https://multi-billowing-lambo.ethereum-sepolia.quiknode.pro/dfabb094d57c748cefa1c35f8273f5e74955f663/`;

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: ENV.WALLET_CONNECT_PROJECT_ID }),
    coinbaseWallet({
      appName: 'Compound III'
    })
  ],
  transports: {
    [sepolia.id]: http(rpc)
  }
});
