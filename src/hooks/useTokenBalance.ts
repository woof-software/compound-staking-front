import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export type UseTokenBalanceProps = {
  address: Address | undefined;
  tokenAddress: Address;
};

export function useTokenBalance(props: UseTokenBalanceProps) {
  const { address, tokenAddress } = props;

  const { data: balanceData } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  const data = balanceData ?? BigInt(0);

  return {
    data
  };
}
