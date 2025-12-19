import { getAddress } from 'viem';

type IntOptions = { min?: number; max?: number };

type Issue = { key: string; message: string; kind: 'missing' | 'invalid' };

function read(key: string): string | undefined {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' ? v.trim() : undefined;
}

function buildEnvOrThrow() {
  const issues: Issue[] = [];

  const requiredString = (key: string): string => {
    const v = read(key);
    if (!v) {
      issues.push({ key, kind: 'missing', message: `Missing required env "${key}"` });
      return '';
    }
    return v;
  };

  const requiredInt = (key: string, opts: IntOptions = {}): number => {
    const raw = requiredString(key);
    if (!raw) return NaN;

    const n = Number(raw);

    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      issues.push({ key, kind: 'invalid', message: `Env "${key}" must be an integer, got "${raw}"` });
      return NaN;
    }

    if (opts.min !== undefined && n < opts.min) {
      issues.push({ key, kind: 'invalid', message: `Env "${key}" must be >= ${opts.min}, got ${n}` });
    }
    if (opts.max !== undefined && n > opts.max) {
      issues.push({ key, kind: 'invalid', message: `Env "${key}" must be <= ${opts.max}, got ${n}` });
    }

    return n;
  };

  const requiredAddress = (key: string): `0x${string}` => {
    const raw = requiredString(key);
    if (!raw) return '0x' as `0x${string}`;

    try {
      return getAddress(raw);
    } catch {
      issues.push({ key, kind: 'invalid', message: `Env "${key}" must be a valid EVM address, got "${raw}"` });
      return '0x' as `0x${string}`;
    }
  };

  const env = {
    BASE_TOKEN_ADDRESS: requiredAddress('VITE_BASE_TOKEN_ADDRESS'),
    BASE_TOKEN_PRICE_FEED_ADDRESS: requiredAddress('VITE_BASE_TOKEN_PRICE_FEED_ADDRESS'),
    BASE_TOKEN_DECIMALS: requiredInt('VITE_BASE_TOKEN_DECIMALS', { min: 0, max: 255 }),
    BASE_TOKEN_PRICE_FEED_DECIMALS: requiredInt('VITE_BASE_TOKEN_PRICE_FEED_DECIMALS', { min: 0, max: 255 }),

    STAKED_TOKEN_ADDRESS: requiredAddress('VITE_STAKED_TOKEN_ADDRESS'),
    STAKED_TOKEN_DECIMALS: requiredInt('VITE_STAKED_TOKEN_DECIMALS', { min: 0, max: 255 }),

    STAKING_VAULT_ADDRESS: requiredAddress('VITE_STAKING_VAULT_ADDRESS'),

    WALLET_CONNECT_PROJECT_ID: requiredString('VITE_WALLET_CONNECT_PROJECT_ID'),
    ETHERSCAN_URL: requiredString('VITE_ETHERSCAN_URL')
  };

  if (issues.length) {
    const missing = issues.filter((i) => i.kind === 'missing').map((i) => `- ${i.key}`);
    const invalid = issues.filter((i) => i.kind === 'invalid').map((i) => `- ${i.message}`);

    const parts: string[] = ['[ENV] Validation failed.'];

    if (missing.length) parts.push(`Missing (${missing.length}):\n${missing.join('\n')}`);
    if (invalid.length) parts.push(`Invalid (${invalid.length}):\n${invalid.join('\n')}`);

    throw new Error(parts.join('\n\n'));
  }

  return Object.freeze(env);
}

export const ENV = buildEnvOrThrow();
