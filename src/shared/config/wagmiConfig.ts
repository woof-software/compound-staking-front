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
        [sepolia.id]: http('https://virtual.sepolia.eu.rpc.tenderly.co/7dd95cea-6f80-4d6b-a6a9-ae155728a443')
      }
    });
  }

  let privatekey = localStorage.getItem(STORAGE_KEY);

  if (!privatekey) {
    privatekey = generatePrivateKey();
    localStorage.setItem(STORAGE_KEY, privatekey);
    const { address } = privateKeyToAccount(<Hex>privatekey);

    fetch('https://virtual.sepolia.eu.rpc.tenderly.co/9ae5ce7a-8d6b-4ce0-bef1-c73b9562fee0', {
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

    fetch('https://virtual.sepolia.eu.rpc.tenderly.co/9ae5ce7a-8d6b-4ce0-bef1-c73b9562fee0', {
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

  const forkUrl = 'https://virtual.sepolia.eu.rpc.tenderly.co/7dd95cea-6f80-4d6b-a6a9-ae155728a443';
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
    async disconnect() {
      localStorage.removeItem(STORAGE_KEY);
    },
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
