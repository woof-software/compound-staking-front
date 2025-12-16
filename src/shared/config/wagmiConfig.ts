import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask(), walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID }), coinbaseWallet()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
});
