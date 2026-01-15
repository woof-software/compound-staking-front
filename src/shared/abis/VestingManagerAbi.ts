export const VestingManagerAbi = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getActiveVestings',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'claimedAmount', type: 'uint256' },
          { internalType: 'uint40', name: 'startTime', type: 'uint40' },
          { internalType: 'uint40', name: 'duration', type: 'uint40' }
        ],
        internalType: 'struct IVestingManagerTypes.Vesting[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
