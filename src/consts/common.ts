export const DEFAULT_STORAGE_KEY = 'theme';

export const V2_URL = 'https://v2-app.compound.finance';
export const TERMS_URL = `${V2_URL}/#terms`;
export const TALLY_GOV_URL = 'https://www.tally.xyz/gov/compound';

export const DEFAULT_INTEGER_PART_LENGTH = 16;
export const COMPOUND_DECIMALS = 18;

export const COMP_ADDRESS = '0xc00e94cb662c3520282e6f5717214004a7f26888';
export const COMP_USD_PRICE_FEED = '0xdbd020caef83efd542f4de03e3cf0c28a4428bd5';

export const WALLET_CONNECT_PROJECT_ID = '1d7947d532af4a24ece0a9b7e7479a32';

export const Currency = {
  USD: 'USD',
  USDC: 'USDC',
  ETH: 'ETH',
  COMP: 'COMP'
} as const;

export const units = [
  { value: 1e33, symbol: 'D' },
  { value: 1e30, symbol: 'N' },
  { value: 1e27, symbol: 'Oc' },
  { value: 1e24, symbol: 'Sp' },
  { value: 1e21, symbol: 'Sx' },
  { value: 1e18, symbol: 'Qi' },
  { value: 1e15, symbol: 'Q' },
  { value: 1e12, symbol: 'T' },
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'K' }
];

/* CONTRACTS  */
export const BASE_TOKEN_DECIMALS = 18;
export const STAKED_TOKEN_ADDRESS = '0x4fBD1F4A09Ca535533549293AEEA50fe8Cd23026';

// MOCK CONTRACTS ADDRESS
export const MOCK_STAKING_VAULT_ADDRESS = '0x993f58396E489352f7B0Fc9aa824E4d53cbD44C1';
export const MOCK_BASE_TOKEN_ADDRESS = '0xe357a464D9e37a50A1BdD71560B5c69a333d301E ';
