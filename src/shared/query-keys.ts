export const queryKeys = {
  stakingVault: {
    root: () => ['stakingVault'],
    stakeInfoOf: (...args: unknown[]) => ['stakingVault', 'stakeInfoOf', args],
    virtualBalanceOf: (...args: unknown[]) => ['stakingVault', 'virtualBalanceOf', args],
    multiplierOf: (...args: unknown[]) => ['stakingVault', 'multiplierOf', args],
    availableRewardsOf: (...args: unknown[]) => ['stakingVault', 'availableRewardsOf', args],
    totalStaked: (...args: unknown[]) => ['stakingVault', 'totalStaked', args]
  }
};
