export const DEFAULT_STORAGE_KEY = 'vite-ui-theme';

export const V2_URL = 'https://v2-app.compound.finance';
export const TERMS_URL = `${V2_URL}/#terms`;
export const TALLY_GOV_URL = 'https://www.tally.xyz/gov/compound';

export const DEFAULT_INTEGER_PART_LENGTH = 16;
export const COMPOUND_DECIMALS = 18;

export const COMP_ADDRESS = '0xc00e94Cb662C3520282E6f5717214004A7f26888';
export const COMP_USD_PRICE_FEED = '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5';

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
