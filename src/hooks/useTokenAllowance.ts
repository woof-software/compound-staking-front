import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export function useTokenAllowance(contractAddress?: Address, owner?: Address, spender?: Address) {
  const { data: allowanceData, ...query } = useReadContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender && !!contractAddress }
  });

  let allowance: bigint | undefined;

  if (typeof allowanceData === 'bigint') {
    allowance = allowanceData;
  }

  return {
    data: allowance,
    ...query
  };
}
