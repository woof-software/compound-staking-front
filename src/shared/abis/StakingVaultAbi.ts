export const StakingVaultAbi = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserStake',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'principal', type: 'uint256' },
          { internalType: 'uint40', name: 'stakeTimestamp', type: 'uint40' },
          { internalType: 'uint40', name: 'lastClaimTime', type: 'uint40' }
        ],
        internalType: 'struct IStakingVaultTypes.StakeInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'virtualBalanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'delegatee', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
