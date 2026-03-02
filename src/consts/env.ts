import { isAddress } from 'viem';
import z from 'zod';

const envsSchema = z.object({
  VITE_BASE_TOKEN_PRICE_FEED_ADDRESS: z.string().refine(isAddress, 'Address required'),
  VITE_BASE_TOKEN_DECIMALS: z.coerce.number().int(),
  VITE_BASE_TOKEN_PRICE_FEED_DECIMALS: z.coerce.number().int(),
  VITE_BASE_APR_DECIMALS: z.coerce.number().int(),
  VITE_STAKED_TOKEN_DECIMALS: z.coerce.number().int(),
  VITE_ANKR_RPC_KEY: z.string(),
  VITE_WALLET_CONNECT_PROJECT_ID: z.string(),
  VITE_ETHERSCAN_URL: z.string(),
  VITE_APP_MODE: z.string().optional()
});

let rawEnvs: z.infer<typeof envsSchema>;

try {
  rawEnvs = envsSchema.parse(import.meta.env);
} catch (e) {
  const messages = ['\n\nEnvironment variables build failure.', '\n'];

  if (e instanceof z.ZodError) {
    messages.push(
      ...e.errors.map((issue) => {
        return `- ${issue.path.at(0)}: ${issue.message}`;
      })
    );

    throw new Error(messages.join('\n'));
  }

  throw e;
}

export const ENV = {
  BASE_TOKEN_PRICE_FEED_ADDRESS: rawEnvs.VITE_BASE_TOKEN_PRICE_FEED_ADDRESS,
  BASE_TOKEN_DECIMALS: rawEnvs.VITE_BASE_TOKEN_DECIMALS,
  BASE_TOKEN_PRICE_FEED_DECIMALS: rawEnvs.VITE_BASE_TOKEN_PRICE_FEED_DECIMALS,
  BASE_APR_DECIMALS: rawEnvs.VITE_BASE_APR_DECIMALS,
  STAKED_TOKEN_DECIMALS: rawEnvs.VITE_STAKED_TOKEN_DECIMALS,
  ANKR_RPC_KEY: rawEnvs.VITE_ANKR_RPC_KEY,
  WALLET_CONNECT_PROJECT_ID: rawEnvs.VITE_WALLET_CONNECT_PROJECT_ID,
  ETHERSCAN_URL: rawEnvs.VITE_ETHERSCAN_URL,
  MODE: rawEnvs.VITE_APP_MODE
};
