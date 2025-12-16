declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID?: string;
  readonly VITE_ETHERSCAN_TX_URL?: string;

  // CONTRACTS
  readonly VITE_BASE_TOKEN_ADDRESS?: string;
  readonly VITE_BASE_TOKEN_PRICE_FEED_ADDRESS?: string;
  readonly VITE_BASE_TOKEN_DECIMALS?: string;
  readonly VITE_BASE_TOKEN_PRICE_FEED_DECIMALS?: string;

  readonly VITE_STAKED_TOKEN_ADDRESS?: string;
  readonly VITE_STAKED_TOKEN_DECIMALS?: string;

  readonly VITE_STAKING_VAULT_ADDRESS?: string;

  readonly VITE_LOCK_MANAGER_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
