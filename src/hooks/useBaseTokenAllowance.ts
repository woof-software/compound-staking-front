import { type Address } from 'viem';

import { ENV } from '@/consts/env';
import { useAllowance } from '@/hooks/useAllowance';

export function useBaseTokenAllowance(owner?: Address) {
  const { data, ...query } = useAllowance(owner, ENV.BASE_TOKEN_ADDRESS);

  return {
    data,
    ...query
  };
}
