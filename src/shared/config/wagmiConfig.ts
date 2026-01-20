import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

import { ENV } from '@/consts/env';

const ANKR_RPC = `https://rpc.ankr.com/eth_sepolia/${ENV.ANKR_RPC_KEY}`;

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask(), walletConnect({ projectId: ENV.WALLET_CONNECT_PROJECT_ID }), coinbaseWallet()],
  transports: {
    [sepolia.id]: http(ANKR_RPC)
  }
});
