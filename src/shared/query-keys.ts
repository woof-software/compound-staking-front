export const queryKeys = {
  stakingVault: {
    root: () => ['stakingVault'],
    stakeInfoOf: (args: unknown[]) => ['stakingVault', 'stakeInfoOf', ...args],
    virtualBalanceOf: (args: unknown[]) => ['stakingVault', 'virtualBalanceOf', ...args],
    multiplierOf: (args: unknown[]) => ['stakingVault', 'multiplierOf', ...args],
    availableRewardsOf: (args: unknown[]) => ['stakingVault', 'availableRewardsOf', ...args]
  },
  lockManager: {
    root: () => ['lockManager'],
    lockDuration: (args: unknown[]) => ['lockManager', 'lockDuration', ...args]
  },
  vestingManager: {
    root: () => ['vestingManager'],
    MAX_VESTINGS_PER_USER: (args: unknown[]) => ['vestingManager', 'MAX_VESTINGS_PER_USER', ...args],
    activeVestingsOf: (args: unknown[]) => ['vestingManager', 'activeVestingsOf', ...args],
    claim: (args: unknown[]) => ['vestingManager', 'claim', ...args]
  },
  subAccount: {
    root: () => ['subAccount'],
    delegationRequest: (args: unknown[]) => ['subAccount', 'delegationRequest', ...args],
    requestDelegation: (args: unknown[]) => ['subAccount', 'requestDelegation', ...args]
  },
  subAccountManager: {
    root: () => ['subAccountManager'],
    subAccountOf: (args: unknown[]) => ['subAccountManager', 'subAccountOf', ...args],
    delegationDelay: (args: unknown[]) => ['subAccountManager', 'delegationDelay', ...args]
  }
};
