import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { ENV } from '@/consts/env';

export function useBaseTokenAllowance(owner?: Address) {
  const { data, ...query } = useReadContract({
    address: ENV.BASE_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner ? [owner, ENV.STAKING_VAULT_ADDRESS] : undefined,
    query: { enabled: !!owner }
  });

  let allowance: bigint | undefined;

  if (typeof data === 'bigint') {
    allowance = data;
  }

  return {
    data: allowance,
    ...query
  };
}
