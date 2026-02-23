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
const ADMIN_URL = 'https://virtual.sepolia.eu.rpc.tenderly.co/e2172497-f7b1-463c-9f29-ff6f2051d41e';
const FORK_CHAIN_ID = 111555111;

function createSandboxConnector() {
  let privatekey = localStorage.getItem(STORAGE_KEY);

  if (!privatekey) {
    privatekey = generatePrivateKey();
    localStorage.setItem(STORAGE_KEY, privatekey);
    const { address } = privateKeyToAccount(<Hex>privatekey);

    fetch(ADMIN_URL, {
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

    fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tenderly_setErc20Balance',
        params: [getDeployment(111555111, 'MockComp').address, address, '0x8AC7230489E80000'],
        id: 1
      })
    });
  }

  if (!isHex(privatekey)) {
    throw new Error('Wrong private key format');
  }

  const account = privateKeyToAccount(privatekey);

  const walletClient = createWalletClient({
    transport: http(ADMIN_URL),
    chain: {
      ...sepolia,
      id: FORK_CHAIN_ID,
      name: 'Sandbox',
      rpcUrls: {
        default: {
          http: [ADMIN_URL]
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

  return createConfig({
    connectors: [sandboxConnector],
    chains: [sepolia],
    ssr: true,
    transports: {
      [sepolia.id]: http(ADMIN_URL)
    }
  });
}

export const config = createSandboxConnector();
