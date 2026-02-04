import { createWalletClient, type Hex, isHex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { createConnector, http } from 'wagmi';
import { createConfig } from 'wagmi';
import { getDeployment } from '@woof-software/compound-staked-comp-artifacts/deployments';

// @ts-expect-error - we do not really care about it while having demo
sepolia.id = 111555111;

// @ts-expect-error - we do not really care about it while having demo
sepolia.name = 'Sandbox';

const STORAGE_KEY = 'pk';

function createSandboxConnector() {
  if (typeof window === 'undefined') {
    return createConfig({
      chains: [sepolia],
      ssr: true,
      transports: {
        [sepolia.id]: http('https://virtual.sepolia.eu.rpc.tenderly.co/be13bd77-e574-49da-86c9-e3d2422cea28')
      }
    });
  }

  let privatekey = localStorage.getItem(STORAGE_KEY);

  if (!privatekey) {
    privatekey = generatePrivateKey();
    localStorage.setItem(STORAGE_KEY, privatekey);
    const { address } = privateKeyToAccount(<Hex>privatekey);

    fetch('https://virtual.sepolia.eu.rpc.tenderly.co/5c22cdc8-568e-486c-88b5-76c7da6c29fb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tenderly_setBalance',
        params: [address, '0xDE0B6B3A7640000'],
        id: 0
      })
    });

    fetch('https://virtual.sepolia.eu.rpc.tenderly.co/5c22cdc8-568e-486c-88b5-76c7da6c29fb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tenderly_setErc20Balance',
        params: [getDeployment(11155111, 'MockComp').address, address, '0x8AC7230489E80000'],
        id: 1
      })
    });
  }

  if (!isHex(privatekey)) {
    throw new Error('Wrong private key format');
  }

  const forkUrl = 'https://virtual.sepolia.eu.rpc.tenderly.co/be13bd77-e574-49da-86c9-e3d2422cea28';
  const forkChainId = 111555111;
  const name = 'Sandbox';

  const account = privateKeyToAccount(privatekey);

  const walletClient = createWalletClient({
    transport: http(forkUrl),
    chain: {
      ...sepolia,
      id: forkChainId,
      name,
      rpcUrls: {
        default: {
          http: [forkUrl]
        }
      }
    },
    account
  });

  const sandboxConnector = createConnector(() => ({
    id: 'sandbox',
    name: 'Sandbox Wallet',
    type: 'sandbox',
    async connect(parameters) {
      const withCapabilities = parameters?.withCapabilities ?? false;

      return {
        accounts: (withCapabilities ? [{ address: account.address, capabilities: {} }] : [account.address]) as never,
        chainId: forkChainId
      };
    },
    async getAccounts() {
      return [account.address];
    },
    async getChainId() {
      return forkChainId;
    },
    async isAuthorized() {
      return true;
    },
    async getClient() {
      return walletClient;
    },
    async getProvider() {
      return walletClient.transport;
    },
    async disconnect() {},
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {}
  }));

  return createConfig({
    connectors: [sandboxConnector],
    chains: [sepolia],
    ssr: true,
    transports: {
      [sepolia.id]: http(forkUrl)
    }
  });
}

export const config = createSandboxConnector();
