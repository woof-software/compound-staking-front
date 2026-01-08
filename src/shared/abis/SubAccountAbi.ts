export const SubAccountAbi = [
  {
    inputs: [],
    name: 'delegationRequest',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'delegatee',
            type: 'address'
          },
          {
            internalType: 'uint64',
            name: 'executableAt',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'executed',
            type: 'bool'
          }
        ],
        internalType: 'struct ISubAccount.DelegationRequest',
        name: 'request',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address'
      }
    ],
    name: 'requestDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
