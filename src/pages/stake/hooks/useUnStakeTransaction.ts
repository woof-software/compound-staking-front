// type LockedCOMPDataType = {
//   amount: bigint;
//   duration: number;
//   startTime: number;
// };

export function useUnStakeTransaction() {
  // const { onIsPendingToggle } = useWalletStore();
  // const { onIsStakeFlowDisabledToggle } = useStakeStore();
  //
  // const { address } = useConnection();
  //
  // const { refetch: refetchCOMPBalance } = useStakedBalance(address);
  // const { refetch: refetchStakedCOMPBalance } = useStakedVirtualBalance(address);
  //
  // const refetchStakeData = useCallback(() => {
  //   refetchCOMPBalance();
  //   refetchStakedCOMPBalance();
  // }, [refetchCOMPBalance, refetchStakedCOMPBalance]);
  //
  // const {
  //   sendTransactionAsync: sendUnstakeRequestTx,
  //   data: unstakeRequestHash,
  //   isPending: isUnstakeRequestPending
  // } = useSendTransaction();
  // const { isLoading: isUnstakeRequestConfirming, isSuccess: isUnstakeRequestSuccess } = useWaitForTransactionReceipt({
  //   hash: unstakeRequestHash
  // });
  //
  // const {
  //   sendTransactionAsync: sendUnlockRequestTx,
  //   data: unlockRequestHash,
  //   isPending: isUnlockRequestPending
  // } = useSendTransaction();
  // const { isLoading: isUnlockRequestConfirming, isSuccess: isUnlockRequestSuccess } = useWaitForTransactionReceipt({
  //   hash: unlockRequestHash
  // });
  //
  // const {
  //   data: lockedCOMPBalanceData,
  //   isFetching: isLockedCOMPBalanceFetching,
  //   refetch: refetchLockedCOMPBalanceData
  // } = useReadContract({
  //   address: ENV.LOCK_MANAGER_ADDRESS,
  //   abi: LockManagerAbi,
  //   functionName: 'getActiveLock',
  //   args: address ? [address] : undefined,
  //   query: { enabled: !!address }
  // });
  //
  // const lockedCOMPData: LockedCOMPDataType = (lockedCOMPBalanceData as LockedCOMPDataType) ?? {
  //   amount: 0n,
  //   duration: 0,
  //   startTime: 0
  // };
  //
  // const isLoading =
  //   isUnstakeRequestPending || isUnstakeRequestConfirming || isUnlockRequestPending || isUnlockRequestConfirming;
  //
  // useEffect(() => {
  //   if (isUnstakeRequestSuccess || isUnlockRequestSuccess) {
  //     refetchStakeData();
  //     refetchLockedCOMPBalanceData();
  //   }
  // }, [isUnstakeRequestSuccess, isUnlockRequestSuccess]);
  //
  // useEffect(() => {
  //   onIsPendingToggle(isLoading);
  // }, [isLoading]);
  //
  // return {
  //   isLoading,
  //
  //   lockedCOMPData,
  //   isLockedCOMPBalanceFetching,
  //
  //   isUnstakeRequestPending,
  //   isUnstakeRequestConfirming,
  //   isUnstakeRequestSuccess,
  //
  //   isUnlockRequestPending,
  //   isUnlockRequestConfirming,
  //   isUnlockRequestSuccess
  // };
}
