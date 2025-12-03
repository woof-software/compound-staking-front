import { ethers } from 'ethers';

export function isAddress(v: any): v is AddressType {
  return ethers.isAddress(v);
}
