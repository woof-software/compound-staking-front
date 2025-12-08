import { HStack } from '@/components/common/HStack';
import { Card } from '@/components/common/stake/Card';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export function StakeFlowBlock() {
  // const { address } = useAccount();
  // const { onIsPendingToggle } = useWalletStore();
  //
  // const [amount, setAmount] = useState('');
  //
  // const {
  //   stakeDev,
  //   isApproveConfirming,
  //   isStakeConfirming,
  //   isStakeSuccess,
  //   approveError,
  //   stakeError,
  //
  //   isLoading,
  //   refetchStake,
  //   showWarning
  // } = useStakeDev({
  //   onIsPendingToggle
  // });
  //
  // const onStakeClick = (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!address || !amount) return;
  //
  //   try {
  //     stakeDev(address, amount);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  //
  // useEffect(() => {
  //   if (isStakeSuccess) {
  //     refetchStake();
  //   }
  // }, [isStakeSuccess, refetchStake]);

  return (
    <Card
      title='Stake'
      tooltip='Stake your COMP tokens to earn yield every second!'
    >
      <HStack justify='between'>
        <VStack gap={12}>
          <Text
            size='11'
            className='text-color-24'
          >
            Staked
          </Text>
          <Text
            size='17'
            weight='500'
          >
            0.0000 COMP
          </Text>
        </VStack>
        <VStack gap={12}>
          <Text
            size='11'
            className='text-color-24'
          >
            stCOMP balance
          </Text>
          <Text
            size='17'
            weight='500'
          >
            0.0000 COMP
          </Text>
        </VStack>
        <VStack gap={12}>
          <Text
            size='11'
            className='text-color-24'
          >
            Multiplier
          </Text>
          <Text
            size='17'
            weight='500'
          >
            1x
          </Text>
        </VStack>
        <VStack gap={12}>
          <Text
            size='11'
            className='text-color-24'
          >
            Available Rewards
          </Text>
          <Text
            size='17'
            weight='500'
          >
            0.0000 COMP
          </Text>
        </VStack>
        <VStack gap={12}>
          <Text
            size='11'
            className='text-color-24'
          >
            APR
          </Text>
          <Text
            size='17'
            weight='500'
          >
            0.00%
          </Text>
        </VStack>
        <Button className='max-w-[130px] text-11 font-medium'>Stake</Button>
      </HStack>
    </Card>
  );
}
