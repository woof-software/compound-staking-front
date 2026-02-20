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
const FORK_URL = 'https://virtual.sepolia.eu.rpc.tenderly.co/7dd95cea-6f80-4d6b-a6a9-ae155728a443';
const FORK_CHAIN_ID = 111555111;

function createSandboxConnector() {
  let _sandboxTimestamp: number | null = null;

  const setTimestamp = (timestamp: Date | number | null) => {
    _sandboxTimestamp =
      timestamp === null ? null : typeof timestamp === 'number' ? timestamp : Math.floor(timestamp.getTime() / 1000);
  };

  if (typeof window === 'undefined') {
    return Object.assign(
      createConfig({
        chains: [sepolia],
        ssr: true,
        transports: {
          [sepolia.id]: http(FORK_URL)
        }
      }),
      { setTimestamp }
    );
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

  const account = privateKeyToAccount(privatekey);

  const walletClient = createWalletClient({
    transport: http(FORK_URL),
    chain: {
      ...sepolia,
      id: FORK_CHAIN_ID,
      name: 'Sandbox',
      rpcUrls: {
        default: {
          http: [FORK_URL]
        }
      }
    },
    account
  });

  const originalSendTransaction = walletClient.sendTransaction.bind(walletClient);
  walletClient.sendTransaction = async (params) => {
    if (_sandboxTimestamp !== null) {
      await fetch(FORK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'evm_setNextBlockTimestamp',
          params: [`0x${_sandboxTimestamp.toString(16)}`],
          id: 0
        })
      });
    }
    return originalSendTransaction(params);
  };

  const sandboxConnector = createConnector(() => ({
    id: 'sandbox',
    name: 'Sandbox Wallet',
    type: 'sandbox',
    async connect(parameters) {
      const withCapabilities = parameters?.withCapabilities ?? false;

      return {
        accounts: (withCapabilities ? [{ address: account.address, capabilities: {} }] : [account.address]) as never,
        chainId: FORK_CHAIN_ID
      };
    },
    async getAccounts() {
      return [account.address];
    },
    async getChainId() {
      return FORK_CHAIN_ID;
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

  return Object.assign(
    createConfig({
      connectors: [sandboxConnector],
      chains: [sepolia],
      ssr: true,
      transports: {
        [sepolia.id]: http(FORK_URL)
      }
    }),
    { setTimestamp }
  );
}

export const config = createSandboxConnector();
