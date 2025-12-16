export const LockManagerAbi = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getActiveLock',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint40', name: 'startTime', type: 'uint40' },
          { internalType: 'uint40', name: 'duration', type: 'uint40' }
        ],
        internalType: 'struct ILockManagerTypes.Lock',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'unlock', outputs: [], stateMutability: 'nonpayable', type: 'function' }
];
