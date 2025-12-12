import { Card } from '@/components/common/stake/Card';
import ClaimModal from '@/components/common/stake/ClaimModal';
import VestingModal from '@/components/common/stake/VestingModal';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';

export function RewardsFlowBlock() {
  const { isEnabled: isVestingOpen, enable: onVestingOpen, disable: onVestingClose } = useSwitch();
  const { isEnabled: isClaimOpen, enable: onClaimOpen, disable: onClaimClose } = useSwitch();

  return (
    <>
      <Card
        title='Stake'
        tooltip='Stake your COMP tokens to earn yield every second!'
      >
        <div className='py-3.5'>
          <div className='border-b flex justify-between border-color-8 px-10 pb-5 '>
            <div className='flex w-full justify-between'>
              <div className='flex flex-col gap-3'>
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
              </div>
              <div className='flex flex-col gap-3'>
                <Text
                  size='11'
                  className='text-color-24'
                >
                  Total to claim
                </Text>
                <Text
                  size='17'
                  weight='500'
                >
                  0.0000 COMP
                </Text>
              </div>
              <Button
                onClick={onClaimOpen}
                className='max-w-32.5 text-[11px] font-medium'
              >
                Claim
              </Button>
            </div>
            <Divider
              orientation='vertical'
              className='max-h-10 min-h-10 mx-12'
            />
            <div className='flex w-full justify-between'>
              <div className='flex flex-col gap-3'>
                <Text
                  size='11'
                  className='text-color-24'
                >
                  Available Rewards
                </Text>
                <div className='flex flex-col gap-2'>
                  <Text
                    size='17'
                    weight='500'
                  >
                    0.0000 COMP
                  </Text>
                  <Text
                    size='11'
                    className='text-color-24'
                  >
                    $40.00
                  </Text>
                </div>
              </div>
              <Button
                onClick={onVestingOpen}
                className='max-w-32.5 text-[11px] font-medium'
              >
                Vest
              </Button>
            </div>
          </div>
          <div className='p-10 flex'>
            <div className='mx-auto items-center w-auto flex flex-col gap-5'>
              <div className='w-44 h-20 no-position-yet' />
              <Text
                size='15'
                weight='500'
                lineHeight='16'
              >
                No Positions Yet
              </Text>
              <Text
                size='15'
                weight='500'
                lineHeight='21'
                className='text-color-24'
              >
                No vested rewards yet
              </Text>
            </div>
          </div>
        </div>
      </Card>
      <VestingModal
        isOpen={isVestingOpen}
        onClose={onVestingClose}
      />
      <ClaimModal
        isOpen={isClaimOpen}
        onClose={onClaimClose}
      />
    </>
  );
}
