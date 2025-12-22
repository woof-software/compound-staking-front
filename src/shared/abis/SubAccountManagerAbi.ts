export const SubAccountManagerAbi = [
  {
    inputs: [],
    name: 'delegationDelay',
    outputs: [
      {
        internalType: 'uint40',
        name: '',
        type: 'uint40'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'subAccountOf',
    outputs: [
      {
        internalType: 'address',
        name: 'subAccount',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
