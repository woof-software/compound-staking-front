import { type FormEvent, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { InfoIcon } from '@/assets/svg';
import { Card } from '@/components/common/stake/Card';

import { useStakeDev } from '../../_hooks/useStake';

// const LazyConnectorsModal = lazy(() => import('../connect-wallet/ConnectorsModal'));

export function StakeFlowBlock() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');

  const {
    stakeDev,
    isApproveConfirming,
    isStakeConfirming,
    isStakeSuccess,
    approveError,
    stakeError,

    isLoading,
    refetchStake,
    showWarning
  } = useStakeDev();

  const onStakeClick = (e: FormEvent) => {
    e.preventDefault();
    if (!address || !amount) return;

    try {
      stakeDev(address, amount);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isStakeSuccess) {
      refetchStake();
    }
  }, [isStakeSuccess, refetchStake]);

  return (
    <Card
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <form
        onSubmit={onStakeClick}
        className='flex flex-col gap-3 max-w-sm'
      >
        <input
          type='number'
          min='0'
          step='0.000000000000000001'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='Amount to stake'
          className='border rounded px-3 py-2'
        />
        {showWarning && (
          <div className='stake-warning'>
            <InfoIcon className='stake-warning__icon' />
            <p className='stake-warning__text'>
              Multiplier reverts to 1x after staking more COMP. All available rewards get vested
            </p>
          </div>
        )}
        <button
          type='submit'
          disabled={!address || !amount || isLoading}
          className='rounded bg-black text-white px-4 py-2 disabled:opacity-50'
        >
          {isLoading ? 'Staking…' : 'Stake'}
        </button>
        {isApproveConfirming && <p>Waiting for approve confirmation…</p>}
        {isStakeConfirming && <p>Waiting for stake confirmation…</p>}
        {isStakeSuccess && <p>Stake successful ✅</p>}
        {approveError && <p className='text-red-500'>Approve error: {String(approveError.message)}</p>}
        {stakeError && <p className='text-red-500'>Stake error: {String(stakeError.message)}</p>}
      </form>
      {/*<HStack justify='between'>*/}
      {/*  <VStack gap={12}>*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      className='text-color-24'*/}
      {/*    >*/}
      {/*      Staked*/}
      {/*    </Text>*/}
      {/*    <Text*/}
      {/*      size='17'*/}
      {/*      weight='500'*/}
      {/*      className='text-color-2'*/}
      {/*    >*/}
      {/*      0.0000 COMP*/}
      {/*    </Text>*/}
      {/*  </VStack>*/}
      {/*  <VStack gap={12}>*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      className='text-color-24'*/}
      {/*    >*/}
      {/*      stCOMP balance*/}
      {/*    </Text>*/}
      {/*    <Text*/}
      {/*      size='17'*/}
      {/*      weight='500'*/}
      {/*      className='text-color-2'*/}
      {/*    >*/}
      {/*      0.0000 COMP*/}
      {/*    </Text>*/}
      {/*  </VStack>*/}
      {/*  <VStack gap={12}>*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      className='text-color-24'*/}
      {/*    >*/}
      {/*      Multiplier*/}
      {/*    </Text>*/}
      {/*    <Text*/}
      {/*      size='17'*/}
      {/*      weight='500'*/}
      {/*      className='text-color-2'*/}
      {/*    >*/}
      {/*      1x*/}
      {/*    </Text>*/}
      {/*  </VStack>*/}
      {/*  <VStack gap={12}>*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      className='text-color-24'*/}
      {/*    >*/}
      {/*      Available Rewards*/}
      {/*    </Text>*/}
      {/*    <Text*/}
      {/*      size='17'*/}
      {/*      weight='500'*/}
      {/*      className='text-color-2'*/}
      {/*    >*/}
      {/*      0.0000 COMP*/}
      {/*    </Text>*/}
      {/*  </VStack>*/}
      {/*  <VStack gap={12}>*/}
      {/*    <Text*/}
      {/*      size='11'*/}
      {/*      className='text-color-24'*/}
      {/*    >*/}
      {/*      APR*/}
      {/*    </Text>*/}
      {/*    <Text*/}
      {/*      size='17'*/}
      {/*      weight='500'*/}
      {/*      className='text-color-2'*/}
      {/*    >*/}
      {/*      0.00%*/}
      {/*    </Text>*/}
      {/*  </VStack>*/}
      {/*  <Button className='max-w-[130px] text-[11px] font-medium'>Stake</Button>*/}
      {/*</HStack>*/}
    </Card>
  );
}
