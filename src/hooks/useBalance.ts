import { useBalance as _useBalance } from 'wagmi';

import { isAddress } from '@/lib/utils/address';

/**
 * A simple wrapper around wagmi's useBalance hook to simplify the API.
 *
 * @param address - User wallet address
 * @param token - Token address
 */
export const useBalance = (address?: string, token?: string) => {
  let _address: AddressType | undefined;
  let _token: AddressType | undefined;

  if (isAddress(address)) {
    _address = address;
  }

  if (isAddress(token)) {
    _token = token;
  }

  const { data: walletBalance } = _useBalance({
    address: _address,
    ...(_token ? { token: _token } : {}),
    blockTag: 'latest'
  });

  return walletBalance ? BigInt(walletBalance.value) : BigInt(0);
};
