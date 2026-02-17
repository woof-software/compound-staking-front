const TENDERLY_ADMIN_URL = 'https://virtual.sepolia.eu.rpc.tenderly.co/9ae5ce7a-8d6b-4ce0-bef1-c73b9562fee0';
const TENDERLY_RPC_URL = 'https://virtual.sepolia.eu.rpc.tenderly.co/7dd95cea-6f80-4d6b-a6a9-ae155728a443';

export async function makeTenderlyRequest(method: string, params: any[], id: number = 0) {
  const response = await fetch(TENDERLY_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Tenderly request failed: ${method} - ${text}`);
  }

  return response.json();
}

async function makeRPCRequest(method: string, params: any[] = []) {
  const response = await fetch(TENDERLY_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now()
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RPC request failed: ${method} - ${text}`);
  }

  return response.json();
}

async function getCurrentBlockTimestamp(): Promise<number> {
  try {
    const blockResponse = await makeRPCRequest('eth_getBlockByNumber', ['latest', false]);

    if (blockResponse.result && blockResponse.result.timestamp) {
      return parseInt(blockResponse.result.timestamp, 16);
    }

    throw new Error('Could not get block timestamp');
  } catch (error) {
    console.warn('Failed to get block timestamp, using current time:', error);
    return Math.floor(Date.now() / 1000);
  }
}

export async function fastForwardTime(seconds: number): Promise<void> {
  const currentBlockTime = await getCurrentBlockTimestamp();
  const futureTime = currentBlockTime + seconds;

  await makeTenderlyRequest('tenderly_setNextBlockTimestamp', [`0x${futureTime.toString(16)}`]);

  await makeTenderlyRequest('evm_mine', []);
}

export const TIME_INTERVALS = {
  HOUR: 60 * 60
} as const;
