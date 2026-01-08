export const SubAccountManagerAbi = [
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
