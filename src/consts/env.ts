import { getAddress } from 'viem';

type IntOptions = {
  min?: number;
  max?: number;
};

function fail(message: string): never {
  throw new Error(`[ENV] ${message}`);
}

function read(key: string): string | undefined {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' ? v.trim() : undefined;
}

function requiredString(key: string): string {
  const v = read(key);
  if (!v) fail(`Missing required env "${key}"`);
  return v;
}

function requiredInt(key: string, opts: IntOptions = {}): number {
  const raw = requiredString(key);
  const n = Number(raw);

  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    fail(`Env "${key}" must be an integer, got "${raw}"`);
  }

  if (opts.min !== undefined && n < opts.min) fail(`Env "${key}" must be >= ${opts.min}, got ${n}`);
  if (opts.max !== undefined && n > opts.max) fail(`Env "${key}" must be <= ${opts.max}, got ${n}`);

  return n;
}

function requiredAddress(key: string): `0x${string}` {
  const raw = requiredString(key);
  try {
    return getAddress(raw);
  } catch {
    fail(`Env "${key}" must be a valid EVM address, got "${raw}"`);
  }
}

export const ENV = {
  BASE_TOKEN_ADDRESS: requiredAddress('VITE_BASE_TOKEN_ADDRESS'),
  BASE_TOKEN_PRICE_FEED_ADDRESS: requiredAddress('VITE_BASE_TOKEN_PRICE_FEED_ADDRESS'),
  BASE_TOKEN_DECIMALS: requiredInt('VITE_BASE_TOKEN_DECIMALS', { min: 0, max: 18 }),
  BASE_TOKEN_PRICE_FEED_DECIMALS: requiredInt('VITE_BASE_TOKEN_PRICE_FEED_DECIMALS', { min: 0, max: 18 }),

  STAKED_TOKEN_ADDRESS: requiredAddress('VITE_STAKED_TOKEN_ADDRESS'),
  STAKED_TOKEN_DECIMALS: requiredInt('VITE_STAKED_TOKEN_DECIMALS', { min: 0, max: 18 }),

  STAKING_VAULT_ADDRESS: requiredAddress('VITE_STAKING_VAULT_ADDRESS')
};
